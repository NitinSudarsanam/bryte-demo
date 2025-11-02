
import * as React from "react";
import { NavigationMenu, DropdownMenu } from "radix-ui";
import classNames from "classnames";
import { Flex, Button, Theme } from '@radix-ui/themes';
import { CaretDownIcon } from "@radix-ui/react-icons";
import "./globals.css";


const Header = () => {
	return (
    <Flex direction="column" gap="2">
		<Theme>
		<NavigationMenu.Root className="NavigationMenuRoot" orientation="vertical">
			<NavigationMenu.List className="NavigationMenuList">
        <NavigationMenu.Item>
          <NavigationMenu.Link
						className="NavigationMenuLink"
						href="http://localhost:3000"
					>
						Sun Logo
					</NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
						className="NavigationMenuLink"
						href="http://localhost:3000/pages/about"
					>
						About Us
					</NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
						className="NavigationMenuLink"
						href="http://localhost:3000/pages/faqs"
					>
						FAQ
					</NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
						className="NavigationMenuLink"
						href="http://localhost:3000/pages/parent-resources"
					>
						Resources
					</NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
						className="NavigationMenuLink"
						href="http://localhost:3000/pages/calendar"
					>
						Calendar
					</NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
						className="NavigationMenuLink"
						href="http://localhost:3000/pages/partners"
					>
						Our Partners
					</NavigationMenu.Link>
        </NavigationMenu.Item>

          <NavigationMenu.Item>
          <NavigationMenu.Link
						className="JoinUsButton"
						href="http://localhost:3000/pages/partners"
					>
						Join Us!
					</NavigationMenu.Link>
        </NavigationMenu.Item>
        
			</NavigationMenu.List>

			<NavigationMenu.Viewport />
		</NavigationMenu.Root>
    </Theme></Flex>
	);
};


export default Header;
