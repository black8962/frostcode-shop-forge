import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import { products, categories, getProductsByCategory, getFeaturedProducts, Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const { toast } = useToast();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddToCart = (product: Product) => {
    setCartCount(prev => prev + 1);
    toast({
      title: "товар добавлен в корзину",
      description: `${product.name} успешно добавлен в корзину`,
    });
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Header onSearch={handleSearch} cartCount={cartCount} />
        
        {searchQuery.trim() === "" ? (
          <>
            {/* Hero Section */}
            <HeroSection />

            {/* Featured Products */}
            <div className="container py-12">
              <CategorySection
                title="рекомендуемые товары"
                products={getFeaturedProducts()}
                onAddToCart={handleAddToCart}
              />
            </div>

            {/* Category Sections */}
            <div className="container space-y-16 pb-12">
              {categories.map((category) => {
                const categoryProducts = getProductsByCategory(category.name);
                if (categoryProducts.length === 0) return null;
                
                return (
                  <div key={category.id} id={category.id}>
                    <CategorySection
                      title={category.name}
                      products={categoryProducts}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Search Results */
          <div className="container py-12">
            <CategorySection
              title={`результаты поиска: "${searchQuery}"`}
              products={filteredProducts}
              onAddToCart={handleAddToCart}
            />
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  ничего не найдено по запросу "{searchQuery}"
                </p>
                <p className="text-muted-foreground mt-2">
                  попробуйте изменить поисковый запрос
                </p>
              </div>
            )}
          </div>
        )}

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
