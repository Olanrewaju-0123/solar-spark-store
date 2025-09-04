import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductDetail from "../ProductDetail";

const apiBase = "http://localhost:4000";

describe("ProductDetail page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(global, "fetch").mockImplementation(
      async (input: RequestInfo | URL) => {
        const url = input.toString();
        if (url.startsWith(`${apiBase}/api/products/1`)) {
          return new Response(
            JSON.stringify({
              id: 1,
              name: "Solar Panel 400W",
              price: 110000,
              description: "High efficiency panel",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          ) as unknown as Response;
        }
        return new Response("Not Found", {
          status: 404,
        }) as unknown as Response;
      }
    );

    (window as any).importMeta = { env: { VITE_API_URL: apiBase } };
  });

  it("renders product details from API", async () => {
    render(
      <MemoryRouter initialEntries={["/product/1"]}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Solar Panel 400W/i)).toBeInTheDocument();
    });
  });
});
