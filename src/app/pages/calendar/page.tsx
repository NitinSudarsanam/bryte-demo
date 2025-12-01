import CalendarEmbed from "./calendar";
import Header from "../../header";
import "./calendar.css"



export default function Calendar() {
  return (
    <div>
        
      <Header/>

      <div className="calendar-container-container">
        <CalendarEmbed/>   
      </div>
      
    </div>
    
  );
}