import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group h-full flex flex-col transition-smooth hover:shadow-card hover:-translate-y-1 cursor-pointer border-border/60">
      <CardContent className="p-0 flex-1" onClick={() => onViewDetails(product)}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-smooth group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 gradient-solar border-0 text-primary-foreground">
              -{discount}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Out of Stock
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product.brand}
            </Badge>
          </div>

          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-smooth">
            {product.name}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">
              ₦{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {product.inStock && product.stockCount <= 10 && (
            <p className="text-xs text-accent font-medium">
              Only {product.stockCount} left in stock
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={!product.inStock}
          className="w-full gradient-solar hover:shadow-solar transition-smooth"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}