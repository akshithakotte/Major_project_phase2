import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Set initial theme before React renders
const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
