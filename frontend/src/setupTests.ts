import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "cross-fetch/polyfill";

// Cleanup DOM after each test
afterEach(() => {
  cleanup();
});

// Ensure global fetch exists (for environments without polyfill auto-attach)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(globalThis as any).fetch) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  (globalThis as any).fetch = require("cross-fetch");
}

// Polyfill ResizeObserver for jsdom (used by Radix UI components)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof (globalThis as any).ResizeObserver === "undefined") {
  class ResizeObserver {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observe() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unobserve() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disconnect() {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver = ResizeObserver as any;
}
