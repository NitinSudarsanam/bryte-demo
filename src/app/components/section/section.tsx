"use client";
import * as React from "react";
import classNames from "classnames";
import "./section.css";

// Type definitions
export interface SectionProps {
  title: string;
  content: React.ReactNode;
  image?: {
    src: string;
    alt: string;
  };
  className?: string;
  imagePosition?: "left" | "right";
  sectionBackgroundColor?: string;
  sectionTextColor?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  content,
  image,
  className,
  imagePosition = "right",
  sectionBackgroundColor,
  sectionTextColor,
}) => {
  const sectionStyle: React.CSSProperties = {
    ...(sectionBackgroundColor && { backgroundColor: sectionBackgroundColor }),
    ...(sectionTextColor && { color: sectionTextColor }),
  };

  return (
    <div
      className={classNames(
        "section",
        {
          "section--with-image": image,
          "section--image-left": image && imagePosition === "left",
          "section--image-right": image && imagePosition === "right",
        },
        className
      )}
      style={sectionStyle}
    >
      <div className="section__text-content">
        <h2 className="section__title">{title}</h2>
        <div className="section__body">{content}</div>
      </div>

      {image && image.src && (
        <div className="section__image-container">
          <img src={image.src} alt={image.alt} className="section__image" />
        </div>
      )}
    </div>
  );
};

export default Section;
