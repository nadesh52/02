import * as React from "react";
import Heroes from "./Heroes";
import Navbar from "./Navbar";
import HeroCard from "./HeroCard";
import HeroSimulate from "./HeroSimulate";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      {/* <Heroes /> */}
      {/* <HeroCard /> */}
      <HeroSimulate />
    </div>
  );
}
