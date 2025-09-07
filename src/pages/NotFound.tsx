import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">страница не найдена</h2>
        <p className="mb-6 text-muted-foreground max-w-md">
          Извините, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link to="/">вернуться на главную</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="#vpn">смотреть каталог</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
