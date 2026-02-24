"use client";

import React from "react";
import Header from "@/app/components/header";
import MobileNav from "./MobileNav";
import "./navigation.css";

const Navigation: React.FC = () => {
  return (
    <>
      <div className="NavigationDesktop" aria-hidden="false">
        <Header />
      </div>
      <div className="NavigationMobile" aria-hidden="false">
        <MobileNav />
      </div>
    </>
  );
};

export default Navigation;
