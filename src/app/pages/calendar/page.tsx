import Image from "next/image";
import CalendarEmbed from "./calendar";
import Header from "@/app/components/header";

export default function Calendar() {
  return (
    <div>
        <Header/>
      <CalendarEmbed/>
    </div>
  );
}