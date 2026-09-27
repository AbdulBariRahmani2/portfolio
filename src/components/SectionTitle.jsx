import React from "react";

export default function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {text && <p className="section-lead">{text}</p>}
    </div>
  );
}
