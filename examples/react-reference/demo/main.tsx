import { setupWorker } from "msw/browser";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app";
import { WorkspaceHandlers } from "@/mocks";

import "@/components/ui/index.css";

const worker = setupWorker(...WorkspaceHandlers);

await worker.start({ onUnhandledRequest: "bypass" });

const root = document.getElementById("root");

if (!root) {
  throw new Error("Не найден корневой элемент демо.");
}

createRoot(root).render(
  <StrictMode>
    <aside style={{ background: "#e6eee8", fontSize: 13, padding: "10px 24px" }}>
      Учебный пример. Код доступа: <strong>demo-access</strong>. Данные никуда не отправляются.
    </aside>
    <App />
  </StrictMode>,
);
