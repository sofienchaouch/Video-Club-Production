import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { formatGoogleDriveLink } from "../utils/googleDrive";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark" | "gold" | "adaptive" | "navbar";
}

export default function Logo({ className = "w-auto h-10", variant = "light" }: LogoProps) {
  const [imgError, setImgError] = useState(false);
  let customLogoUrl = "";
  try {
    const context = useApp();
    if (context?.agencySettings?.agencyLogo) {
      customLogoUrl = formatGoogleDriveLink(context.agencySettings.agencyLogo, 'image');
    }
  } catch (e) {
    // If rendered outside AppProvider context
  }

  useEffect(() => {
    setImgError(false);
  }, [customLogoUrl]);

  if (customLogoUrl && !imgError) {
    return (
      <img
        key={customLogoUrl}
        src={customLogoUrl}
        alt="Video Club Production Logo"
        className={`${className} object-contain`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  // Color variables for the solid folder logo matching the official brand identity
  let folderFill = "#ffffff";
  let innerBoxFill = "#000000";
  let videoTextColor = "#ffffff";
  let clubTextColor = "#ffffff";
  let productionTextColor = "#ffffff";
  let showGradients = false;

  if (variant === "dark") {
    folderFill = "#000000";
    innerBoxFill = "#ffffff";
    videoTextColor = "#000000";
    clubTextColor = "#000000";
    productionTextColor = "#000000";
  } else if (variant === "gold") {
    folderFill = "url(#logo-gold-grad)";
    innerBoxFill = "#000000";
    videoTextColor = "#ffffff";
    clubTextColor = "url(#logo-gold-grad)";
    productionTextColor = "#ffffff";
    showGradients = true;
  } else if (variant === "adaptive") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 410 350"
        className={className}
        fill="none"
      >
        <g transform="translate(205, 172.5) skewX(-11) translate(-205, -172.5)">
          <path
            d="M 45,15 h 105 c 15,0 25,10 25,25 v 5 c 0,15 10,25 25,25 h 165 c 15,0 25,10 25,25 v 155 c 0,15 -10,25 -25,25 H 45 c -15,0 -25,-10 -25,-25 V 40 c 0,-15 10,-25 25,-25 z"
            fill="currentColor"
          />
          <rect x="50" y="95" width="310" height="155" rx="14" fill="#000000" />
          <text
            x="205"
            y="162"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Montserrat', 'Space Grotesk', 'Inter', sans-serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="62"
            fill="#ffffff"
            style={{ letterSpacing: "-2px" }}
          >
            VIDEO
          </text>
          <text
            x="205"
            y="226"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Montserrat', 'Space Grotesk', 'Inter', sans-serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="62"
            fill="#ffffff"
            style={{ letterSpacing: "-2px" }}
          >
            CLUB
          </text>
        </g>
        <text
          x="205"
          y="328"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Montserrat', 'Space Grotesk', 'Inter', sans-serif"
          fontWeight="500"
          fontSize="21"
          fill="currentColor"
          style={{ letterSpacing: "13px", textTransform: "uppercase" }}
        >
          PRODUCTION
        </text>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 410 350"
      className={className}
      fill="none"
    >
      {showGradients && (
        <defs>
          <linearGradient id="logo-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="45%" stopColor="#dbb374" />
            <stop offset="100%" stopColor="#b48c4e" />
          </linearGradient>
        </defs>
      )}

      {/* Main Folder & Text skewed group */}
      <g transform="translate(205, 172.5) skewX(-11) translate(-205, -172.5)">
        {/* Solid Outer Folder Shape */}
        <path
          d="M 45,15 h 105 c 15,0 25,10 25,25 v 5 c 0,15 10,25 25,25 h 165 c 15,0 25,10 25,25 v 155 c 0,15 -10,25 -25,25 H 45 c -15,0 -25,-10 -25,-25 V 40 c 0,-15 10,-25 25,-25 z"
          fill={folderFill}
        />

        {/* Inner Slanted Box */}
        <rect
          x="50"
          y="95"
          width="310"
          height="155"
          rx="14"
          fill={innerBoxFill}
        />

        {/* Bold italicized display typography */}
        <text
          x="205"
          y="162"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Montserrat', 'Space Grotesk', 'Inter', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="62"
          fill={videoTextColor}
          style={{ letterSpacing: "-2px" }}
        >
          VIDEO
        </text>
        <text
          x="205"
          y="226"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Montserrat', 'Space Grotesk', 'Inter', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="62"
          fill={clubTextColor}
          style={{ letterSpacing: "-2px" }}
        >
          CLUB
        </text>
      </g>

      {/* "PRODUCTION" Sub-title text */}
      <text
        x="205"
        y="328"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Montserrat', 'Space Grotesk', 'Inter', sans-serif"
        fontWeight="400"
        fontSize="21"
        fill={productionTextColor}
        style={{ letterSpacing: "13px", textTransform: "uppercase" }}
      >
        PRODUCTION
      </text>
    </svg>
  );
}
