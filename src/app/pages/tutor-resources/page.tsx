"use client";

import * as React from "react";
import Header from "@/app/components/header";
import CollapsibleLinkSection from "@/app/components/links-section/links-section";
import "./tutor-resources.css";

type LinkItem = {
  title: string;
  url: string;
  description?: string | null;
};

type TutorSection = {
  slug: string;
  title: string;
  info?: string | null;
  links: LinkItem[];
};

const ResourcesForBryteTutorsPage: React.FC = () => {
  const [sections, setSections] = React.useState<TutorSection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/tutor-resources");
        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }
        const data = await res.json();
        setSections(data.sections || []);
      } catch (e) {
        console.error("Failed to load tutor resources:", e);
        setError("Unable to load tutor resources at this time.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="tutor-resources-page">
      <div className="tutor-resources-inner">
        <Header />
        <h1 className="tutor-resources-title">Tutor Resources</h1>

        {loading && <p>Loading…</p>}
        {error && <p>{error}</p>}

        {!loading && !error && sections.length === 0 && (
          <p>No resources available right now.</p>
        )}

        {!loading &&
          !error &&
          sections.map((section) => {
            const linksDict: Record<string, string> = {};
            section.links.forEach((link) => {
              if (link.title && link.url) {
                linksDict[link.title] = link.url;
              }
            });

            return (
              <CollapsibleLinkSection
                key={section.slug}
                title={section.title}
                links={linksDict}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ResourcesForBryteTutorsPage;
