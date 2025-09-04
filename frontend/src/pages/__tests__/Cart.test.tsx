import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Index from "../Index";
import { Toaster } from "@/components/ui/toaster";

const apiBase = "http://localhost:4000";

describe("Cart interactions - checkout error", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // First call: GET /api/products → return 1 product
    // Second call: POST /api/orders → return 400 error with message
    vi.spyOn(global, "fetch")
      .mockImplementationOnce(async (input: RequestInfo | URL) => {
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
                  stock: 5,
                },
              ],
              total: 1,
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
      })
      .mockImplementationOnce(async () => {
        // POST /api/orders
        return new Response(
          JSON.stringify({
            success: false,
            error: { message: "Payment failed" },
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        ) as unknown as Response;
      });

    (window as any).importMeta = { env: { VITE_API_URL: apiBase } };
  });

  it("shows checkout error message when API returns error", async () => {
    render(
      <MemoryRouter>
        <Index />
        <Toaster />
      </MemoryRouter>
    );

    // Wait for product to render
    await screen.findByText(/Solar Panel 400W/i, undefined, { timeout: 5000 });

    // Click "Add to Cart"
    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    await userEvent.click(addToCartButton);

    // Open cart via header cart icon (fallback heuristic)
    const cartButton = screen
      .getAllByRole("button")
      .find((b) => b.innerHTML.includes("shopping-cart"));
    if (cartButton) {
      await userEvent.click(cartButton);
    }

    // Click checkout
    const checkoutBtn = await screen.findByRole("button", {
      name: /checkout/i,
    });
    await userEvent.click(checkoutBtn);

    // Assert error description appears in toast
    await screen.findByText(/payment failed/i, undefined, { timeout: 5000 });
  });
});
