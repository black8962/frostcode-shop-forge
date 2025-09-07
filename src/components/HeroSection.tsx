import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-banner.jpg";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 to-accent/20 py-24 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              добро пожаловать в{" "}
              <span className="text-primary">фросткод</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Премиум цифровые товары и услуги высочайшего качества. 
              VPN, софт, каналы и инструменты для профессионалов.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-lg"
                onClick={() => {
                  document.getElementById('vpn')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                смотреть каталог
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg"
                onClick={() => {
                  window.open('https://t.me/frostmeneger', '_blank');
                }}
              >
                связаться с нами
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img
              src={heroImage}
              alt="фросткод - цифровые товары"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}