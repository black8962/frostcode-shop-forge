import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
}

interface CategorySectionProps {
  title: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewAll?: () => void;
}

export function CategorySection({ title, products, onAddToCart, onViewAll }: CategorySectionProps) {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">{title}</h2>
        {onViewAll && (
          <Button variant="outline" onClick={onViewAll}>
            смотреть все
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}