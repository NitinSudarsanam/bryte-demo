import CalendarEmbed from "./calendar";
import "./calendar.css"

import Section from "@/app/components/section/section";
import Header from "@/app/components/header";
import Masthead from "@/app/components/masthead/masthead";

export default function Calendar() {
  return (
    <div>
      <Header />
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
        title="ETC CALENDAR"
        content="Additional calendar information and events can be found here. Check back regularly for updates on upcoming BRYTE performances, workshops, and community events."
        sectionBackgroundColor="#FCE794"
        sectionTextColor="#000"
      />
    </div>
  );
}