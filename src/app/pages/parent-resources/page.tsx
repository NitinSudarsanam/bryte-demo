"use client";

import * as React from "react";
import Header from "@/app/components/header";
import CollapsibleLinkSection from "@/app/components/links-section/links-section";
import "./parent-resources.css";

type LinksDict = Record<string, string>;

const ResourcesForBryteParentsPage: React.FC = () => {
  const [links, setLinks] = React.useState<LinksDict | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/parent-resources");
        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }
        const data = await res.json();
        setLinks(data.links || {});
      } catch (e) {
        console.error("Failed to load parent resources:", e);
        setError("Unable to load parent resources at this time.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="parent-resources-page">
      <div className="parent-resources-inner">
        <Header />
        <h1 className="parent-resources-title">Parent Resources</h1>

        {loading && <p>Loading…</p>}
        {error && <p>{error}</p>}

        {!loading && links && Object.keys(links).length > 0 && (
          <CollapsibleLinkSection
            title="English Language Learning Classes"
            links={links}
          />
        )}

        {!loading &&
          !error &&
          links &&
          Object.keys(links).length === 0 && (
            <p>No resources available right now.</p>
          )}
      </div>
    </div>
  );
};

export default ResourcesForBryteParentsPage;
