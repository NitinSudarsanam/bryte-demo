import Image from "next/image";
import CalendarEmbed from "./calendar";
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
      <CalendarEmbed />
    </div>
  );
}
