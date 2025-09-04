import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { ProductCard, Product } from "@/components/ui/product-card";
import { Filters, FilterState } from "@/components/ui/filters";
import { CartSheet, CartItem } from "@/components/ui/cart-sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { categories, brands, priceRange } from "@/data/products";
import { LayoutGrid, List, ShoppingCart, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 9;
const API_BASE =
  (import.meta as any)?.env?.VITE_API_URL || "http://localhost:3001";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: priceRange,
    inStockOnly: false,
  });
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverProducts, setServerProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  // Fetch products from API with server-side pagination and filters
  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("pageSize", String(ITEMS_PER_PAGE));
        if (searchQuery) params.set("q", searchQuery);
        if (filters.categories.length > 0)
          params.set("category", filters.categories[0]);
        if (filters.priceRange[0] !== priceRange[0])
          params.set("minPrice", String(filters.priceRange[0]));
        if (filters.priceRange[1] !== priceRange[1])
          params.set("maxPrice", String(filters.priceRange[1]));

        // Map sort options to backend
        let sortByField = "name";
        let sortOrder = "ASC";
        if (sortBy === "price-low") {
          sortByField = "price";
          sortOrder = "ASC";
        } else if (sortBy === "price-high") {
          sortByField = "price";
          sortOrder = "DESC";
        } else if (sortBy === "name") {
          sortByField = "name";
          sortOrder = "ASC";
        }
        params.set("sortBy", sortByField);
        params.set("sortOrder", sortOrder);

        const res = await fetch(
          `${API_BASE}/api/products?${params.toString()}`,
          {
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
        const data = await res.json();

        // Map backend products to ProductCard shape with safe defaults
        const mapped: Product[] = (data.items || []).map((p: any) => ({
          id: String(p.id),
          name: p.name ?? "Unnamed",
          description: p.description ?? "",
          price: Number(p.price ?? 0),
          originalPrice: undefined,
          image:
            p.imageUrl ?? "https://via.placeholder.com/600x400?text=Product",
          category: p.category ?? "General",
          brand: p.brand ?? "",
          rating: 4.5,
          reviewCount: 0,
          inStock: (p.stock ?? 1) > 0,
          stockCount: Number(p.stock ?? 0),
        }));

        setServerProducts(mapped);
        setTotal(data.total ?? mapped.length);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message || "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [currentPage, searchQuery, filters, sortBy]);

  // Use server-provided products and total pages
  const paginatedProducts = serverProducts;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        toast({
          title: "Quantity updated",
          description: `${product.name} quantity increased to ${
            existing.quantity + 1
          }`,
        });
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items before checkout",
      });
      return;
    }

    try {
      const body = {
        customerName: "Guest",
        customerEmail: "guest@example.com",
        shippingAddress: {
          street: "123 Demo St",
          city: "Lagos",
          state: "LA",
          zipCode: "100001",
          country: "NG",
        },
        items: cart.map((ci) => ({
          productId: parseInt(ci.id, 10),
          quantity: ci.quantity,
        })),
        paymentMethod: "credit_card",
      };

      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(
          data?.error?.message || `Checkout failed (${res.status})`
        );
      }

      toast({
        title: "Order placed",
        description: "Redirecting to confirmation",
      });
      setCart([]);
      navigate(`/order/${data.data.id}`);
    } catch (e: any) {
      toast({
        title: "Checkout failed",
        description: e.message,
        variant: "destructive" as any,
      });
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setShowCart(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Filters
              filters={filters}
              onFiltersChange={setFilters}
              availableCategories={categories}
              availableBrands={brands}
              priceRange={priceRange}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Solar Equipment</h2>
                <p className="text-muted-foreground">
                  Page {currentPage} of {totalPages} • {total} items
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort Options */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <Card className="p-12 text-center">
                <CardContent>Loading products…</CardContent>
              </Card>
            ) : error ? (
              <Card className="p-12 text-center">
                <CardContent className="text-destructive">{error}</CardContent>
              </Card>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onViewDetails={() => navigate(`/product/${product.id}`)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => setCurrentPage(i + 1)}
                              isActive={currentPage === i + 1}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <Card className="p-12 text-center">
                <CardContent>
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setFilters({
                        categories: [],
                        brands: [],
                        priceRange: priceRange,
                        inStockOnly: false,
                      });
                    }}
                  >
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Cart Sheet */}
      <CartSheet
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Index;
