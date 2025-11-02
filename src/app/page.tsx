
import * as React from "react";
import { NavigationMenu, DropdownMenu } from "radix-ui";
import classNames from "classnames";
import { Flex, Button, Theme } from '@radix-ui/themes';
import { CaretDownIcon } from "@radix-ui/react-icons";
import "./globals.css";
import Header from './header';
export default function HomePage() {
  return (
      <div>
        <Header/>
      </div>
    );
}