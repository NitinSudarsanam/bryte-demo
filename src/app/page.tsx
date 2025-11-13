
import * as React from "react";
import { NavigationMenu, DropdownMenu } from "radix-ui";
import classNames from "classnames";
import { Flex, Button, Theme } from '@radix-ui/themes';
import { CaretDownIcon } from "@radix-ui/react-icons";
import "./globals.css";
import Header from '@/app/components/header';
import Slideshow from "@/app/components/slideshow";

const slides = [
  { id: "1", image: "/slide1.png", caption: "Lorem impsum dolor sit amet" },
  { id: "2", image: "/slide2.png", caption: "Lorem impsum dolor sit amet" },
];

export default function HomePage() {
  return (
      <div>
        <Header/>
        <Slideshow
          slides={slides}
        />
      </div>
    
    );
}