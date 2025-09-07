import { ThemeToggle } from "@/components/ThemeToggle";

export function Footer() {
  return (
    <footer className="border-t bg-store-section">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">фросткод</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Премиум цифровые товары и услуги высочайшего качества
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">тема:</span>
              <ThemeToggle />
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-semibold mb-4">контакты</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">менеджер:</span>
                <br />
                <a 
                  href="https://t.me/frostmeneger" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @frostmeneger
                </a>
              </div>
              <div>
                <span className="text-muted-foreground">канал:</span>
                <br />
                <a 
                  href="https://t.me/frostcode" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @frostcode
                </a>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">информация</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>ИП Моржуль Иван Юрьевич</p>
              <p>ИНН 383406600613</p>
              <p className="mt-4 text-xs">
                © 2024 фросткод. все права защищены.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}