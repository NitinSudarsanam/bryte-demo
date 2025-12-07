"use client";
import React, { useEffect, useState } from "react";
import "./masthead.css";

type MastheadProps = { className?: string };
const words: string[] = ["child", "family", "care"];
const Masthead: React.FC<MastheadProps> = ({ className }) => {
  const [index, setIndex] = useState<number>(0);
  const [fading, setFading] = useState<boolean>(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setFading(true);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFading(false);
      }, 250);
    }, 2400);
    return () => window.clearInterval(intervalId);
  }, []);

  const rootClass = ["bryte-masthead", className].filter(Boolean).join(" ");
  return (
    <header className={rootClass}>
      <div className="bryte-row bryte-row-top">
        <span className="bryte-at">@</span>
        <div className="bryte-wordmark">BRYTE</div>
        <div className="bryte-star-wrap">
          <img src="/masthead-star.svg" alt="" className="bryte-star" />
        </div>
        <div className="bryte-pill bryte-pill-short bryte-pill-maroon" />
      </div>

      <div className="bryte-row bryte-row-middle">
        <div className="bryte-pill bryte-pill-long bryte-pill-orange">
          Brown Refugee Youth Tutoring & Enrichment
        </div>
      </div>

      <div className="bryte-row bryte-row-bottom">
        <div className="bryte-circle-large" />
        <div className="bryte-whole-text">WHOLE</div>
        <div className="bryte-pill bryte-pill-short bryte-pill-light bryte-pill-animated bryte-pill-fixed">
          <span
            className={
              "bryte-animated-word" +
              (fading ? " bryte-animated-word--fading" : "")
            }
          >
            {words[index]}
          </span>
        </div>
      </div>
    </header>
  );
};
export default Masthead;
