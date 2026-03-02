import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or system preference
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-secondary/50 hover:bg-secondary border border-border"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-warning" />
          <span className="text-muted-foreground hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
