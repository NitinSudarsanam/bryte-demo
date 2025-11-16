"use client";
import * as React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Flex, Theme } from '@radix-ui/themes';
import "./header.css";

const Header: React.FC = () => {
  return (
    <Flex direction="column" gap="2">
      <Theme>
        <NavigationMenu.Root className="NavigationMenuRoot" orientation="vertical">
          <NavigationMenu.List className="NavigationMenuList">
            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href="/"
              >
                Sun Logo
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href="/pages/about"
              >
                About Us
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href="/pages/faqs"
              >
                FAQ
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href="/pages/parent-resources"
              >
                Resources
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href="/pages/calendar"
              >
                Calendar
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href="/pages/partners"
              >
                Our Partners
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="JoinUsButton"
                href="/pages/contact"
              >
                Join Us!
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>

          <NavigationMenu.Viewport />
        </NavigationMenu.Root>
      </Theme>
    </Flex>
  );
};

export default Header;