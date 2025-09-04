import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API_BASE =
  (import.meta as any)?.env?.VITE_API_URL || "http://localhost:3001";

const OrderConfirmation = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/orders/${id}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(
            data?.error?.message || `Failed to load order (${res.status})`
          );
        }
        setOrder(data.data);
      } catch (e: any) {
        if (e.name !== "AbortError") setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent>Loading order…</CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-destructive">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 space-y-4">
          <h1 className="text-2xl font-bold">Order Confirmed</h1>
          <p className="text-muted-foreground">
            Thank you! Your order has been placed.
          </p>
          <div className="text-sm">
            <div>
              <span className="font-medium">Order ID:</span> {order?.id}
            </div>
            <div>
              <span className="font-medium">Status:</span> {order?.status}
            </div>
            <div>
              <span className="font-medium">Total:</span> ₦
              {Number(order?.total ?? 0).toLocaleString()}
            </div>
          </div>
          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Items</h2>
            <ul className="space-y-2 text-sm">
              {order?.orderItems?.map((it: any) => (
                <li key={it.id} className="flex justify-between">
                  <span>{it.product?.name || `Product #${it.productId}`}</span>
                  <span>
                    x{it.quantity} • ₦{Number(it.unitPrice).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-2">
            <Link to="/">
              <Button>Back to store</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmation;
