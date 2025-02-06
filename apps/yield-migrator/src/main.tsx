import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Providers from "@/Providers";
import App from "./App.tsx";

import "@rainbow-me/rainbowkit/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
