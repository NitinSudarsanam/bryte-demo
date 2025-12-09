import CalendarEmbed from "./calendar";
import Header from "../../header";
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
      <CalendarEmbed />
        
      <Header/>

      <div className="calendar-container-container">
        <CalendarEmbed/>   
      </div>

      <Section
        title="ETC CALENDAR"
        content="BRYTE has received numerous awards since its inception in 2006. 
Most recently, BRYTE won the 2017: Student Leadership Award: Best Collaboration from Brown University for our collaborative effort with Impulse Dance Company. We have also been the recipients of the 2013 Student Leadership Award: Forming Partnerships from Brown 

BRYTE has received numerous awards since its inception in 2006. Most recently, BRYTE won the 2017: Student Leadership Award: Best Collaboration from Brown University for our collaborative effort with Impulse Dance Company. We have also been the recipients of the 2013 Student Leadership Award: Forming Partnerships from Brown"
        
        sectionBackgroundColor="#FCE794"
        sectionTextColor="#000"
      ></Section>

    </div>

    
      
    
  );
    
  
}
