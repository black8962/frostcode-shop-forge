import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-primary">хит</Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {product.price.toLocaleString()} ₽
            </span>
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onAddToCart(product)}
          className="w-full"
          variant="default"
        >
          в корзину
        </Button>
      </CardFooter>
    </Card>
  );
}