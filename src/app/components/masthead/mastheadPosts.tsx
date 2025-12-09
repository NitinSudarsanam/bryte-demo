"use client";
import React from "react";
import "./masthead.css";

type MastheadPostsProps = { className?: string };

const MastheadPosts: React.FC<MastheadPostsProps> = ({ className }) => {
  const rootClass = ["bryte-masthead", className].filter(Boolean).join(" ");

  return (
    <header className={rootClass}>
      <div className="bryte-row bryte-row-top">
        <div className="bryte-wordmark">BRYTE</div>
        <div className="bryte-star-wrap">
          <img src="/masthead-star.svg" alt="" className="bryte-star" />
        </div>
        <div className="bryte-pill bryte-pill-short bryte-pill-forest" />
      </div>

      <div className="bryte-row bryte-row-middle">
        <div className="bryte-pill bryte-pill-long bryte-pill-orange"></div>
        <div className="bryte-whole-text">BLOGS</div>
      </div>
    </header>
  );
};

export default MastheadPosts;
