"use client";
import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import classNames from "classnames";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import "./accordion.css";

// Type definitions
export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionComponentProps {
  title?: string;
  items: AccordionItemData[];
  className?: string;
}

const AccordionComponent: React.FC<AccordionComponentProps> = ({
  title,
  items,
  className,
}) => {
  // Track refs for each Accordion item
  const itemRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  // Smoothly scroll the opened item into view
  const handleValueChange = (value: string | string[] | null) => {
    if (typeof value === "string" && itemRefs.current[value]) {
      setTimeout(() => {
        itemRefs.current[value]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300); // matches CSS transition time
    }
  };

  return (
    <div className={classNames("accordion-container", className)}>
      {title && <h1 className="accordion-title">{title}</h1>}

      <Accordion.Root
        className="AccordionRoot"
        type="single"
        collapsible
        onValueChange={handleValueChange}
      >
        {items.map((item) => (
          <Accordion.Item
            key={item.id}
            className="AccordionItem"
            value={item.id}
            ref={(el) => {
              itemRefs.current[item.id] = el;
            }}
          >
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
};

// ---- Custom Trigger + Content Components ---- //

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="AccordionHeader">
    <Accordion.Trigger
      className={classNames("AccordionTrigger", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <TriangleDownIcon className="AccordionTriangle" aria-hidden />
    </Accordion.Trigger>
  </Accordion.Header>
));

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={classNames("AccordionContent", className)}
    {...props}
    ref={forwardedRef}
  >
    <div className="AccordionContentText">{children}</div>
  </Accordion.Content>
));

AccordionTrigger.displayName = "AccordionTrigger";
AccordionContent.displayName = "AccordionContent";

export default AccordionComponent;
