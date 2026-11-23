/*
  Nace Drex decisions for contact-form triage.

  This runs on Node only, never in the browser bundle: the request carries
  NACE_API_KEY, which must stay out of the static site. Call routeContactMessage()
  from whatever server handles the form later, or run this file directly to make a
  decision about the sample submission below:

    NACE_API_KEY=... node scripts/nace-drex.mjs
    node --env-file=.env scripts/nace-drex.mjs "our checkout page is down"
*/

import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DREX_ENDPOINT = "https://console.nace.ai/v1/systemone";
export const DREX_MODEL = "drex-latest";

/* Act on a yes/no answer only above this probability. */
export const URGENT_THRESHOLD = 0.8;

/* Act on a choice only when its top label clears this probability and this margin. */
export const MIN_CONFIDENCE = 0.7;
export const MIN_MARGIN = 0.25;

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* Load a local .env when the key was not exported in the shell (Node 20.12+). */
function loadDotEnv() {
  if (process.env.NACE_API_KEY) return;
  const envFile = resolve(PROJECT_ROOT, ".env");
  if (existsSync(envFile)) {
    try {
      process.loadEnvFile(envFile);
    } catch {
      // An unreadable .env is reported by readApiKey() instead.
    }
  }
}

export function readApiKey() {
  loadDotEnv();
  const apiKey = process.env.NACE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "NACE_API_KEY is not set. Copy .env.example to .env and add your key, or export it in your shell."
    );
  }
  return apiKey;
}

/* POST state + typed questions to Drex and return its full answer payload. */
export async function decideDrex({
  state,
  questions,
  model = DREX_MODEL,
  apiKey = readApiKey(),
  endpoint = DREX_ENDPOINT,
  signal = AbortSignal.timeout(30_000)
} = {}) {
  if (state === undefined || state === null) throw new Error("decideDrex needs a case state.");
  if (!questions || Object.keys(questions).length === 0) {
    throw new Error("decideDrex needs at least one question.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ model, state, questions }),
    signal
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = payload?.error?.message ?? payload?.message ?? response.statusText;
    throw new Error(`Drex request failed (${response.status}): ${detail}`);
  }
  return payload;
}

/* The questions asked about every message that lands in the contact form. */
export const CONTACT_QUESTIONS = {
  is_urgent: {
    type: "noul",
    instructions:
      "Does this message ask for work to start within two weeks, or describe a problem that is already costing the sender money?"
  },
  project_kind: {
    type: "choice",
    instructions: "Which kind of project is this?",
    criteria: {
      business_website: "A marketing or brochure site for a business: pages, content, contact details.",
      web_application: "A custom application with user accounts, stored data or internal workflows.",
      saas_product: "A subscription product with plans, billing or a customer dashboard.",
      website_improvement: "A website that exists already and needs performance, SEO, accessibility or design work.",
      unclear: "The message is too short or too vague to tell what is being built."
    }
  }
};

/*
  Turn the per-option probabilities into a route. Low confidence or a close
  second option goes to a person instead of being automated.
*/
export function chooseRoute({ isUrgent, kind, probabilities = {} }) {
  const ranked = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);
  const [topLabel, topProbability] = ranked[0] ?? [kind, 0];
  const runnerUp = ranked[1]?.[1] ?? 0;

  if (
    topLabel === "unclear" ||
    topProbability < MIN_CONFIDENCE ||
    topProbability - runnerUp < MIN_MARGIN
  ) {
    return "manual_review";
  }
  if (isUrgent >= URGENT_THRESHOLD) return "priority_discovery";
  switch (topLabel) {
    case "saas_product":
      return "discovery_call";
    case "web_application":
      return "technical_scope";
    case "website_improvement":
      return "audit_follow_up";
    case "business_website":
      return "standard_reply";
    default:
      return "manual_review";
  }
}

/* Decide where one contact-form message should go. */
export async function routeContactMessage({ message, projectType = "", decide = decideDrex }) {
  if (!message || !message.trim()) throw new Error("routeContactMessage needs a message.");

  const decision = await decide({
    state: {
      source: "abdulbarirahmani.com contact form",
      submitted_project_type: projectType || "(not selected)",
      message
    },
    questions: CONTACT_QUESTIONS
  });

  const urgency = decision?.answers?.is_urgent;
  const kind = decision?.answers?.project_kind;
  if (typeof urgency?.noul !== "number" || !kind?.choice) {
    throw new Error("Drex answered without the expected is_urgent and project_kind answers.");
  }

  return {
    route: chooseRoute({
      isUrgent: urgency.noul,
      kind: kind.choice,
      probabilities: kind.probabilities
    }),
    isUrgent: urgency.noul,
    kind: kind.choice,
    confidence: kind.confidence,
    probabilities: kind.probabilities ?? {},
    requestId: decision.request_id
  };
}

const SAMPLE_MESSAGE =
  "Hi Abdul, our checkout page breaks on iPhones and we are losing orders every day this week. " +
  "We need a web application fix and would like work to start in the next ten days.";

async function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const message = args.find((arg) => !arg.startsWith("--")) ?? SAMPLE_MESSAGE;

  const result = await routeContactMessage({ message });

  if (asJson) {
    console.log(JSON.stringify({ model: DREX_MODEL, ...result }, null, 2));
    return;
  }

  console.log(`Drex answered (model ${DREX_MODEL}, request ${result.requestId}).`);
  console.log(`  urgent: ${(result.isUrgent * 100).toFixed(1)}%  route: ${result.route}`);
  console.log(`  project kind: ${result.kind} @ ${(result.confidence * 100).toFixed(1)}% confidence`);
  for (const [label, probability] of Object.entries(result.probabilities)) {
    console.log(`    ${label}: ${(probability * 100).toFixed(1)}%`);
  }
}

const isDirectRun =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
