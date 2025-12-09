"use client";
import React, { useEffect, useState } from "react";
import "./masthead.css";

type DecorativePill = {
  colorClass: string;
  size?: "short" | "medium" | "long";
  row?: number; // Which row to place the pill on (0-indexed)
  position?: "left" | "right"; // Which side
};

type MastheadProps = {
  className?: string;
  showAtSymbol?: boolean;
  topRowPillColorClass?: string;
  showLargeTitle?: boolean;
  titleWords?: string[];
  decorativePills?: DecorativePill[];
  subtitle?: string;
  animatedWords?: string[];
  showWholeSection?: boolean;
};

const Masthead: React.FC<MastheadProps> = ({
  className,
  showAtSymbol = true,
  topRowPillColorClass = "bryte-pill-maroon",
  showLargeTitle = false,
  titleWords = [],
  decorativePills = [],
  subtitle,
  animatedWords,
  showWholeSection = true,
}) => {
  const [index, setIndex] = useState<number>(0);
  const [fading, setFading] = useState<boolean>(false);

  useEffect(() => {
    if (!animatedWords || animatedWords.length === 0) return;

    const intervalId = window.setInterval(() => {
      setFading(true);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % animatedWords.length);
        setFading(false);
      }, 250);
    }, 2400);
    return () => window.clearInterval(intervalId);
  }, [animatedWords]);

  const rootClass = ["bryte-masthead", className].filter(Boolean).join(" ");

  // Get pills for a specific row and position
  const getPillsForRow = (rowIdx: number, position: "left" | "right") => {
    return decorativePills.filter(
      (pill) => pill.row === rowIdx && pill.position === position
    );
  };

  return (
    <header className={rootClass}>
      <div className="bryte-row bryte-row-top">
        {showAtSymbol && <span className="bryte-at">@</span>}
        <div className="bryte-wordmark">BRYTE</div>
        <div className="bryte-star-wrap">
          <img src="/masthead-star.svg" alt="" className="bryte-star" />
        </div>
        <div
          className={`bryte-pill bryte-pill-short ${topRowPillColorClass}`}
        />
      </div>

      {showLargeTitle && titleWords.length > 0 && (
        <div className="bryte-title-section">
          {titleWords.map((word, rowIdx) => (
            <div key={rowIdx} className="bryte-row bryte-row-title">
              {/* Left pills for this row */}
              {getPillsForRow(rowIdx, "left").map((pill, idx) => (
                <div
                  key={`left-${idx}`}
                  className={`bryte-pill bryte-pill-decorative ${
                    pill.size === "long"
                      ? "bryte-pill-decorative-long"
                      : pill.size === "medium"
                      ? "bryte-pill-decorative-medium"
                      : "bryte-pill-decorative-short"
                  } ${pill.colorClass}`}
                />
              ))}

              {/* Title word for this row */}
              <div className="bryte-title-text">{word}</div>

              {/* Right pills for this row */}
              {getPillsForRow(rowIdx, "right").map((pill, idx) => (
                <div
                  key={`right-${idx}`}
                  className={`bryte-pill bryte-pill-decorative ${
                    pill.size === "long"
                      ? "bryte-pill-decorative-long"
                      : pill.size === "medium"
                      ? "bryte-pill-decorative-medium"
                      : "bryte-pill-decorative-short"
                  } ${pill.colorClass}`}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {subtitle && (
        <div className="bryte-row bryte-row-middle">
          <div className="bryte-pill bryte-pill-long bryte-pill-orange">
            {subtitle}
          </div>
        </div>
      )}

      {showWholeSection && animatedWords && animatedWords.length > 0 && (
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
              {animatedWords[index]}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
export default Masthead;
