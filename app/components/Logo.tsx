import React from "react";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 512 512"
      className={className}
      fill="currentColor"
    ></svg>
  );
}
