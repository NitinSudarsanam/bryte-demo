"use client";
import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import classNames from "classnames";
import { TriangleDownIcon } from "@radix-ui/react-icons";
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
  const entries = Object.entries(links);
  const itemRef = React.useRef<HTMLDivElement | null>(null);

  // Smoothly scroll the opened item into view
  const handleValueChange = (value: string) => {
    if (value && itemRef.current) {
      setTimeout(() => {
        itemRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300); // matches CSS transition time
    }
  };

  if (!entries.length) return null;

  return (
    <Accordion.Root
      className={classNames("cls", className)}
      type="single"
      collapsible
      onValueChange={handleValueChange}
    >
      <Accordion.Item 
        className="cls-item" 
        value="item-1"
        ref={itemRef}
      >
        <Accordion.Header className="cls__header">
          <Accordion.Trigger className="cls__trigger">
            <h2 className="cls__title">{title}</h2>
            <TriangleDownIcon className="cls__icon" aria-hidden />
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content className="cls__content">
          <div className="cls__body">
            <div className="cls__grid">
              {entries.map(([label, href]) => (
                <a
                  key={`${label}-${href}`}
                  href={href}
                  className="cls__link"
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                >
                  {label}
                </a>
              ))}
            </div>
            {entries.length === 0 && (
              <p className="cls__no-links">No links available.</p>
            )}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default CollapsibleLinkSection;
