import vpnImage from "@/assets/vpn-product.jpg";
import programmingImage from "@/assets/programming-product.jpg";
import softwareImage from "@/assets/software-product.jpg";
import telegramImage from "@/assets/telegram-product.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
}

export const products: Product[] = [
  // VPN Products
  {
    id: "vpn-premium",
    name: "Premium VPN",
    description: "Защищенное соединение с высокой скоростью, без ограничений трафика",
    price: 299,
    image: vpnImage,
    category: "VPN",
    featured: true,
  },
  {
    id: "vpn-basic",
    name: "Basic VPN",
    description: "Базовый VPN доступ с хорошей скоростью и стабильностью",
    price: 199,
    image: vpnImage,
    category: "VPN",
  },
  {
    id: "vpn-family",
    name: "Family VPN",
    description: "VPN для всей семьи до 5 устройств одновременно",
    price: 499,
    image: vpnImage,
    category: "VPN",
  },
  
  // Programming Products
  {
    id: "ide-license",
    name: "IDE Pro License",
    description: "Профессиональная лицензия на популярные IDE для разработки",
    price: 1299,
    image: programmingImage,
    category: "программирование",
    featured: true,
  },
  {
    id: "coding-course",
    name: "Курс программирования",
    description: "Полный курс по современным технологиям разработки",
    price: 2999,
    image: programmingImage,
    category: "программирование",
  },
  {
    id: "dev-tools",
    name: "Dev Tools Pack",
    description: "Набор инструментов для эффективной разработки",
    price: 899,
    image: programmingImage,
    category: "программирование",
  },
  
  // Software Clients
  {
    id: "premium-app",
    name: "Premium App License",
    description: "Лицензия на премиум версию популярного приложения",
    price: 599,
    image: softwareImage,
    category: "софт клиенты",
  },
  {
    id: "office-suite",
    name: "Office Suite Pro",
    description: "Профессиональный офисный пакет с расширенными возможностями",
    price: 1499,
    image: softwareImage,
    category: "софт клиенты",
    featured: true,
  },
  {
    id: "security-soft",
    name: "Security Software",
    description: "Комплексная защита для вашего устройства",
    price: 799,
    image: softwareImage,
    category: "софт клиенты",
  },
  
  // Telegram Channels
  {
    id: "trading-channel",
    name: "Trading Signals",
    description: "Эксклюзивные торговые сигналы от профессиональных трейдеров",
    price: 999,
    image: telegramImage,
    category: "тг каналы",
    featured: true,
  },
  {
    id: "crypto-news",
    name: "Crypto News VIP",
    description: "Первые новости из мира криптовалют и блокчейна",
    price: 499,
    image: telegramImage,
    category: "тг каналы",
  },
  {
    id: "tech-insider",
    name: "Tech Insider",
    description: "Инсайдерская информация о новых технологиях и стартапах",
    price: 699,
    image: telegramImage,
    category: "тг каналы",
  },
];

export const categories = [
  { id: "vpn", name: "VPN", href: "#vpn" },
  { id: "programming", name: "программирование", href: "#programming" },
  { id: "software", name: "софт клиенты", href: "#software" },
  { id: "channels", name: "тг каналы", href: "#channels" },
];

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured);
}