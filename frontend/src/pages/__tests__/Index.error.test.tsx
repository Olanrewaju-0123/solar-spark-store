import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Index from "../Index";

const apiBase = "http://localhost:4000";

describe("Index page - error state", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("Server error", { status: 500 }) as unknown as Response
    );
    (window as any).importMeta = { env: { VITE_API_URL: apiBase } };
  });

  it("renders error card when API returns 500", async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
    });
  });
});
