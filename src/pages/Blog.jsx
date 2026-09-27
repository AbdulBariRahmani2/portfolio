import React from "react";
import { ArrowUpRight } from "lucide-react";
import { blogPosts } from "../data";
import SectionTitle from "../components/SectionTitle";

export default function Blog() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">BLOG & INSIGHTS</p>
          <h1>What I'm learning, building and thinking about.</h1>
          <p>A place for technical articles, development notes, AI discussions and lessons from building products.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="LATEST" title="Articles to be published here." />
          <div className="blog-grid">
            {blogPosts.map(post => (
              <article className="blog-card" key={post.title}>
                <div className="blog-top"><span>{post.category}</span><small>{post.date}</small></div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <button className="text-link" type="button">Read article <ArrowUpRight size={16}/></button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
