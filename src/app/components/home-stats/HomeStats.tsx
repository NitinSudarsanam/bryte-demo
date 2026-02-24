"use client";

import React from "react";
import "./home-stats.css";

export interface HomeStatItem {
  value: string;
  description: string;
  /** "maroon" | "orange" or any CSS color (hex, rgb, etc.) */
  bubble_color?: string;
}

interface HomeStatsProps {
  stats: HomeStatItem[];
}

const BUBBLE_COLOR_MAP: Record<string, string> = {
  maroon: "#963e3b",
  orange: "#e48d3c",
};

function getBubbleStyle(color?: string): React.CSSProperties {
  if (!color) return {};
  const normalized = color.trim().toLowerCase();
  const hex = BUBBLE_COLOR_MAP[normalized] ?? (normalized.startsWith("#") || normalized.startsWith("rgb") ? color : undefined);
  if (!hex && !normalized.startsWith("#") && !normalized.startsWith("rgb")) return {};
  return { backgroundColor: hex || color };
}

export default function HomeStats({ stats }: HomeStatsProps) {
  if (!stats?.length) return null;

  return (
    <section className="HomeStats" aria-label="Key statistics">
      <ul className="HomeStats__list">
        {stats.map((item, index) => {
          const bubbleColor = item.bubble_color;
          const style = getBubbleStyle(bubbleColor);
          const fallbackClass = index % 2 === 0 ? "HomeStats__bubble--maroon" : "HomeStats__bubble--orange";
          const bubbleClassName = style.backgroundColor
            ? "HomeStats__bubble"
            : `HomeStats__bubble ${fallbackClass}`;

          return (
            <li key={`${item.value}-${index}`} className="HomeStats__item">
              <span className="HomeStats__value">{item.value}</span>
              <span className={bubbleClassName} style={style}>
                {item.description}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
