"use client";

import React, { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { NavLinks } from "./NavLinks";
import "./mobile-nav.css";

const LogoIcon: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M51.9788 0L59.3056 15.1433L71.8688 3.95509L72.8446 20.7512L88.7344 15.2231L83.2063 31.1129L100.002 32.0887L88.8143 44.6519L103.958 51.9788L88.8143 59.3056L100.002 71.8688L83.2063 72.8446L88.7344 88.7344L72.8446 83.2063L71.8688 100.002L59.3056 88.8143L51.9788 103.958L44.6519 88.8143L32.0887 100.002L31.1129 83.2063L15.2231 88.7344L20.7512 72.8446L3.95509 71.8688L15.1433 59.3056L0 51.9788L15.1433 44.6519L3.95509 32.0887L20.7512 31.1129L15.2231 15.2231L31.1129 20.7512L32.0887 3.95509L44.6519 15.1433L51.9788 0Z" fill="#FCE794"/>
    <path d="M52.4619 13.1155L58.0081 24.5785L67.5182 16.1094L68.2568 28.8236L80.2849 24.639L76.1003 36.6671L88.8145 37.4057L80.3454 46.9157L91.8084 52.4619L80.3454 58.0081L88.8145 67.5182L76.1003 68.2568L80.2849 80.2849L68.2568 76.1003L67.5182 88.8145L58.0081 80.3454L52.4619 91.8084L46.9157 80.3454L37.4057 88.8145L36.6671 76.1003L24.639 80.2849L28.8236 68.2568L16.1094 67.5182L24.5785 58.0081L13.1155 52.4619L24.5785 46.9157L16.1094 37.4057L28.8236 36.6671L24.639 24.639L36.6671 28.8236L37.4057 16.1094L46.9157 24.5785L52.4619 13.1155Z" fill="#DF8035"/>
    <path d="M52.5 29L55.8125 35.8464L61.4925 30.7881L61.9336 38.3818L69.1175 35.8825L66.6182 43.0664L74.2119 43.5075L69.1536 49.1875L76 52.5L69.1536 55.8125L74.2119 61.4925L66.6182 61.9336L69.1175 69.1175L61.9336 66.6182L61.4925 74.2119L55.8125 69.1536L52.5 76L49.1875 69.1536L43.5075 74.2119L43.0664 66.6182L35.8825 69.1175L38.3818 61.9336L30.7881 61.4925L35.8464 55.8125L29 52.5L35.8464 49.1875L30.7881 43.5075L38.3818 43.0664L35.8825 35.8825L43.0664 38.3818L43.5075 30.7881L49.1875 35.8464L52.5 29Z" fill="#9B3C35"/>
  </svg>
);

const HamburgerIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MobileNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleOpenChange = (next: boolean) => setOpen(next);
  const closeDrawer = () => setOpen(false);

  return (
    <div className="MobileNavRoot">
      <header className="MobileNavBar">
        <Link href="/" className="MobileNavBarBrand" aria-label="BRYTE Home">
          <span className="MobileNavBarText">BRYTE</span>
          <LogoIcon />
        </Link>
        <Dialog.Root open={open} onOpenChange={handleOpenChange} modal>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="MobileNavTrigger"
              aria-label="Open navigation menu"
              aria-expanded={open}
            >
              <HamburgerIcon />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="MobileNavOverlay" />
            <Dialog.Content
              className="MobileNavDrawer"
              aria-describedby={undefined}
              onPointerDownOutside={closeDrawer}
              onEscapeKeyDown={closeDrawer}
            >
              <Dialog.Title className="MobileNavDrawerTitle">Navigation Menu</Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="MobileNavClose"
                  aria-label="Close navigation menu"
                >
                  <CloseIcon />
                </button>
              </Dialog.Close>
              <nav className="MobileNavDrawerNav" aria-label="Main navigation">
                <NavLinks
                  direction="vertical"
                  onNavigate={closeDrawer}
                  currentPathname={pathname}
                />
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </header>
    </div>
  );
};

export default MobileNav;
