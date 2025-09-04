import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";

const API_BASE =
  (import.meta as any)?.env?.VITE_API_URL || "http://localhost:3001";

type ProductResponse = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  category?: string;
  imageUrl?: string;
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/products/${id}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to load product (${res.status})`);
        const data = await res.json();
        setProduct(data);
      } catch (e: any) {
        if (e.name !== "AbortError") setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={0}
        onCartClick={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
      />
      <main className="container px-4 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          ← Back
        </Button>

        {loading ? (
          <Card className="p-12 text-center">
            <CardContent>Loading product…</CardContent>
          </Card>
        ) : error ? (
          <Card className="p-12 text-center">
            <CardContent className="text-destructive">{error}</CardContent>
          </Card>
        ) : product ? (
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            <div>
              <img
                src={
                  product.imageUrl ||
                  "https://via.placeholder.com/800x600?text=Product"
                }
                alt={product.name}
                className="w-full h-auto rounded-lg border"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <div className="text-muted-foreground">{product.category}</div>
              <div className="text-xl font-semibold">
                ₦{Number(product.price ?? 0).toLocaleString()}
              </div>
              <div className="text-sm">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </div>
              <p className="text-sm leading-6 whitespace-pre-line">
                {product.description}
              </p>
              <div className="pt-2">
                <Button
                  disabled={product.stock <= 0}
                  onClick={() => navigate("/", { replace: false })}
                >
                  Add to Cart (from catalog)
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

