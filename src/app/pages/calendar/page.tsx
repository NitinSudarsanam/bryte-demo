import DOMPurify from "isomorphic-dompurify";
import { fetchCosmicObject } from "@/app/lib/cosmic";
import CalendarEmbed from "./calendar";
import "./calendar.css";
import Section from "@/app/components/section/section";
import Masthead from "@/app/components/masthead/masthead";

const DEFAULT_CALENDAR_TITLE = "ETC CALENDAR";
const DEFAULT_CALENDAR_CONTENT =
  "Additional calendar information and events can be found here. Check back regularly for updates on upcoming BRYTE performances, workshops, and community events.";

export default async function CalendarPage() {
  let calendarSection: { metadata?: { header?: string; body_text?: string } } | null = null;
  try {
    calendarSection = await fetchCosmicObject({
      bucketSlug: process.env.COSMIC_BUCKET_SLUG!,
      readKey: process.env.COSMIC_READ_KEY!,
      type: "sections",
      slug: "calendar-section",
      props: "slug,title,metadata,type",
      depth: 1,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching calendar-section:", error);
    }
  }

  const title = calendarSection?.metadata?.header?.trim() || DEFAULT_CALENDAR_TITLE;
  const bodyHtml =
    calendarSection?.metadata?.body_text?.trim() || DEFAULT_CALENDAR_CONTENT;
  const content = (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(bodyHtml),
      }}
    />
  );

  return (
    <div>
      <Masthead
        showLargeTitle={true}
        showAtSymbol={false}
        topRowPillColorClass="bryte-pill-green"
        titleWords={["Calendar"]}
        decorativePills={[
          {
            colorClass: "bryte-pill-maroon",
            size: "medium",
            row: 0,
            position: "left",
          },
        ]}
      />

      <div className="calendar-container-container">
        <CalendarEmbed />
      </div>

      <Section
        title={title}
        content={content}
        sectionBackgroundColor="#FCE794"
        sectionTextColor="#000"
      />
    </div>
  );
}