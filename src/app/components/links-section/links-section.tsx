"use client";
import * as React from "react";
import classNames from "classnames";
import "./links-section.css";

export interface CollapsibleLinkSectionProps {
  title: string;
  links: Record<string, string>;
  className?: string;
}

const CollapsibleLinkSection: React.FC<CollapsibleLinkSectionProps> = ({
  title,
  links,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const entries = Object.entries(links);

  if (!entries.length) return null;

  return (
    <div className={classNames("cls", className)}>
      <button
        className="cls__header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h2 className="cls__title">{title}</h2>
        <span className="cls__icon">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div className="cls__body">
          <div className="cls__grid">
            {entries.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="cls__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleLinkSection;
