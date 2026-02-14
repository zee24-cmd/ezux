import React, { useState, useEffect } from "react";

export interface AnimatedTextProps {
  /** 
   * The text content to animate.
   * @group Properties 
   */
  text: string;
  /** 
   * Custom class names for styling.
   * @group Properties 
   */
  className?: string;
  /** 
   * Default text color.
   * @group Properties 
   */
  defaultColor?: string;
  /** 
   * Text to highlight (will use primary color and wobble effect).
   * @group Properties 
   */
  highlight?: string;
  /** 
   * Animation delay.
   * @group Properties 
   */
  delay?: string;
  /**
   * Custom text size class (overrides default).
   * @group Properties
   */
  textSize?: string;
  /**
   * Direction for the main text.
   * @group Properties
   */
  textDir?: "ltr" | "rtl";
  /**
   * Direction for the highlight text.
   * @group Properties
   */
  highlightDir?: "ltr" | "rtl";
}

// Brand colors from the source
const BRAND_COLORS = ["#06d6a0", "#ef476f", "#ffd166", "#118ab2", "#073b4c"];

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = "",
  defaultColor = "#2d2e33",
  highlight,
  delay,
  textSize,
  textDir,
  highlightDir,
}) => {
  const characters = text.split("");
  const sizeClasses = textSize || "text-4xl md:text-5xl lg:text-6xl";
  const mergedClassName = `${sizeClasses} font-black tracking-tight ${className}`;
  const highlightChars = highlight ? highlight.split("") : [];
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Suppress unused variable
  void delay;

  useEffect(() => {
    // Check for dark mode on mount
    const checkDarkMode = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      checkDarkMode();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkDarkMode);
    };
  }, []);

  const effectiveDefaultColor = isDarkMode ? "#ffffff" : defaultColor;

  return (
    <span
      className={`flex flex-col justify-center items-center ${mergedClassName}`}
      style={{ letterSpacing: "-0.05em" }} // Essential for the Coolors "compact" look
    >
      <style>
        {`
          @keyframes wobble {
            0% { transform: translateX(0); }
            20% { transform: translateX(-4px); }
            40% { transform: translateX(4px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>

      <span className="flex flex-wrap justify-center text-center" dir={textDir}>
        {characters.map((char, index) => (
          <Character
            key={`main-${index}`}
            char={char}
            defaultColor={effectiveDefaultColor}
            brandColor={BRAND_COLORS[index % BRAND_COLORS.length]}
          />
        ))}
      </span>

      {highlight && (
        <span className="flex flex-wrap justify-center text-center mt-2" dir={highlightDir}>
          {highlightChars.map((char, index) => (
            <Character
              key={`highlight-${index}`}
              char={char}
              defaultColor="oklch(var(--primary))"
              brandColor={BRAND_COLORS[(characters.length + index) % BRAND_COLORS.length]}
            />
          ))}
        </span>
      )}
    </span>
  );
};

const Character = ({
  char,
  defaultColor,
  brandColor,
}: {
  char: string;
  defaultColor: string;
  brandColor: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // To handle the animation reset properly
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleAnimationEnd = () => {
    setIsHovered(false);
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onAnimationEnd={handleAnimationEnd}
      style={{
        display: "inline-block",
        whiteSpace: "pre", // Keeps word gaps tight
        cursor: "default",
        fontWeight: 900,
        padding: "0 1px", // Provides just enough room to wobble without overlapping
        color: isHovered ? brandColor : defaultColor,
        // Mimic the framer motion: x: [-4, 4, -4, 4, 0] with repeat: 2
        // We defined wobble as one cycle of -4, 4, -4, 4, 0. 
        // So we run it twice to match repeat: 2. 
        // 0.8s duration per cycle.
        animation: isHovered ? "wobble 0.8s ease-in-out 2" : "none",
        transition: "color 0.2s ease",
      }}
    >
      {char}
    </span>
  );
};