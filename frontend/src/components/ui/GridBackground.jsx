import React from "react";
import { BackgroundBeams } from "./BackgroundBeams"; // Adjust the path based on your project structure

const GridBackground = ({ children }) => {
  return (
    <div className="relative overflow-hidden">
      <BackgroundBeams className="absolute inset-0 -z-10" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GridBackground;
