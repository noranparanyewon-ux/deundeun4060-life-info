import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Router } from "wouter";

const routerBase = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(<Router base={routerBase}><App /></Router>);
