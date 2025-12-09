import Header from "@/app/components/header";
import Masthead from "@/app/components/masthead/masthead";

export default function UpartnersPage() {
  return (
    <div>
      <Header />
      <Masthead
        showLargeTitle={true}
        showAtSymbol={false}
        topRowPillColorClass="bryte-pill-green"
        titleWords={["Community", "Partners"]} // One line
        decorativePills={[
          {
            colorClass: "bryte-pill-maroon",
            size: "short",
            row: 0,
            position: "left",
          },
          {
            colorClass: "bryte-pill-orange",
            size: "medium",
            row: 1,
            position: "right",
          },
        ]}
      />
    </div>
  );
}
