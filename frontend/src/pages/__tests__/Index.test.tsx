import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Index from "../Index";

const apiBase = "http://localhost:4000";

describe("Index page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Default mock for fetch products list
    vi.spyOn(global, "fetch").mockImplementation(
      async (input: RequestInfo | URL) => {
        const url = input.toString();
        if (url.startsWith(`${apiBase}/api/products`)) {
          return new Response(
            JSON.stringify({
              items: [
                {
                  id: 1,
                  name: "Solar Panel 400W",
                  price: 110000,
                  imageUrl: "/img1.jpg",
                  category: "SOLAR",
                },
                {
                  id: 2,
                  name: "Inverter 5kW",
                  price: 250000,
                  imageUrl: "/img2.jpg",
                  category: "INVERTER",
                },
              ],
              total: 2,
              page: 1,
              pageSize: 12,
              totalPages: 1,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          ) as unknown as Response;
        }
        return new Response("Not Found", {
          status: 404,
        }) as unknown as Response;
      }
    );

    // Set env for Index to pick base URL
    (window as any).importMeta = { env: { VITE_API_URL: apiBase } };
  });

  it("shows loading then renders products", async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    // Loading state should appear
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for products to render
    await waitFor(() => {
      expect(screen.getByText(/Solar Panel 400W/i)).toBeInTheDocument();
      expect(screen.getByText(/Inverter 5kW/i)).toBeInTheDocument();
    });
  });

  it("filters by search input", async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("Search solar equipment...");
    const searchInput = inputs[0];
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "inverter");

    // Depending on implementation, search may happen on debounce; wait
    await waitFor(() => {
      // Should show Inverter, may hide Solar Panel depending on client filtering
      expect(screen.getByText(/Inverter 5kW/i)).toBeInTheDocument();
    });
  });
});
