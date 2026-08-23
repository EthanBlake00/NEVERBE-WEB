"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("neverbe_theme") as "dark" | "light") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("neverbe_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark / Light Mode"
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
      className="flex shrink-0 items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-white/10 transition-all group cursor-pointer border border-white/10 bg-transparent outline-none m-0 p-0"
    >
      {theme === "dark" ? (
        <Sun
          size={20}
          className="text-[var(--v2-text-secondary)] group-hover:text-[var(--v2-accent)] group-hover:rotate-45 transition-all duration-300"
        />
      ) : (
        <Moon
          size={20}
          className="text-[var(--v2-text-secondary)] group-hover:text-[var(--v2-accent)] group-hover:-rotate-12 transition-all duration-300"
        />
      )}
    </button>
  );
}
