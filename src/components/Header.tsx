import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartDrawer } from "@/components/CartDrawer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface HeaderProps {
  onSearch: (query: string) => void;
  cartCount: number;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export function Header({ onSearch, cartCount, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { name: "VPN", href: "#vpn" },
    { name: "программирование", href: "#programming" },
    { name: "софт клиенты", href: "#software" },
    { name: "тг каналы", href: "#channels" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-6">
          <h1 className="text-2xl font-bold text-primary">фросткод</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.href}
              className="transition-colors hover:text-primary text-muted-foreground"
            >
              {category.name}
            </a>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 mx-4">
          <div className="relative w-64">
            <Input
              type="search"
              placeholder="поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </form>

        {/* Cart */}
        <CartDrawer
          cartCount={cartCount}
          cartItems={cartItems}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onClearCart={onClearCart}
        />

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-b md:hidden">
          <div className="container py-4 space-y-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </form>

            {/* Mobile navigation */}
            <nav className="flex flex-col space-y-2">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={category.href}
                  className="block px-2 py-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}