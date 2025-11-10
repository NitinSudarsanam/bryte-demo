"use client";

import * as React from "react";
import classNames from "classnames";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import "./slideshow.css";

export interface Slide {
  id: string;
  image: string;
  caption?: string;
}

export interface SlideshowComponentProps {
  slides: Slide[];
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

const SlideshowComponent: React.FC<SlideshowComponentProps> = ({
  slides,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const current = slides[currentIndex];
  const prev = slides[(currentIndex - 1 + slides.length) % slides.length];
  const next = slides[(currentIndex + 1) % slides.length];

  return (
    <div className={classNames("slideshow-wrapper", className)}>

      <div className="slideshow-frame">
        {/* Left button */}
        <Button
          variant="ghost"
          onClick={prevSlide}
          className="slideshow-arrow left"
        >
          <ArrowLeftIcon width={40} height={40} />
        </Button>

        {/* Visible slides: prev | current | next */}
        <div className="slideshow-track">
          <img
            src={prev.image}
            alt="Previous"
            className="slide side-slide"
          />
          <img
            src={current.image}
            alt={current.caption}
            className="slide main-slide"
          />
          <img
            src={next.image}
            alt="Next"
            className="slide side-slide"
          />
        </div>

        {/* Right button */}
        <Button
          variant="ghost"
          onClick={nextSlide}
          className="slideshow-arrow right"
        >
          <ArrowRightIcon width={40} height={40} />
        </Button>
      </div>

      {current.caption && (
        <div className="slideshow-caption">{current.caption}</div>
      )}
    </div>
  );
};

export default SlideshowComponent;
