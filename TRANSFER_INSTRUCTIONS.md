# Инструкции по переносу фростcode

## 📋 Общая информация

Данные инструкции описывают процесс переноса интернет-магазина **фростcode** с базой данных, веб-сайтом и интеграцией с ЮKassa.

### Реквизиты ИП
- **ИП**: Моржуль Иван Юрьевич
- **ИНН**: 383406600613

---

## 🗄️ Перенос базы данных (Supabase)

### 1. Подготовка исходной базы данных

```sql
-- Создание дампа базы данных
pg_dump -h your-old-db-host -U postgres -d your_database_name > frostcode_backup.sql

-- Экспорт таблиц в CSV (альтернативный метод)
COPY products TO '/path/to/products.csv' DELIMITER ',' CSV HEADER;
COPY orders TO '/path/to/orders.csv' DELIMITER ',' CSV HEADER;
COPY users TO '/path/to/users.csv' DELIMITER ',' CSV HEADER;
```

### 2. Настройка новой Supabase базы

1. Создайте новый проект в [Supabase](https://supabase.com)
2. Получите URL и анонимный ключ из Settings > API
3. Настройте таблицы:

```sql
-- Таблица продуктов
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица заказов
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT NOT NULL,
    items JSONB NOT NULL,
    total_amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    yookassa_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица пользователей
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Включение RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политики безопасности
CREATE POLICY "Продукты видны всем" ON products FOR SELECT USING (true);
CREATE POLICY "Заказы доступны только владельцу" ON orders FOR ALL USING (auth.uid()::text = user_id);
```

### 3. Импорт данных

```sql
-- Восстановление из дампа
psql -h your-new-supabase-host -U postgres -d postgres < frostcode_backup.sql

-- Или импорт из CSV
COPY products FROM '/path/to/products.csv' DELIMITER ',' CSV HEADER;
```

---

## 🌐 Перенос веб-сайта

### 1. Экспорт кода из GitHub

```bash
# Клонирование репозитория
git clone https://github.com/black8962/yookassa-cart-forge.git frostcode-new

# Переход в директорию
cd frostcode-new

# Установка зависимостей
npm install
```

### 2. Обновление конфигурации

Создайте файл `.env.local`:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# YooKassa
VITE_YOOKASSA_SHOP_ID=your_yookassa_shop_id
VITE_YOOKASSA_SECRET_KEY=your_yookassa_secret_key

# Общие настройки
VITE_SITE_URL=https://your-domain.com
```

### 3. Деплой на Vercel/Netlify

```bash
# Для Vercel
npm install -g vercel
vercel --prod

# Для Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 💳 Настройка интеграции с ЮKassa

### 1. Регистрация в ЮKassa

1. Зарегистрируйтесь на [yookassa.ru](https://yookassa.ru)
2. Пройдите верификацию как ИП (ИНН: 383406600613)
3. Получите Shop ID и Secret Key

### 2. Настройка Webhook

В панели ЮKassa настройте уведомления:

- **URL**: `https://your-domain.com/api/yookassa/webhook`
- **Методы**: `payment.succeeded`, `payment.canceled`

### 3. Код интеграции

Создайте файл `src/lib/yookassa.ts`:

```typescript
interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  orderId: string;
  returnUrl: string;
}

export async function createPayment(data: PaymentData) {
  const response = await fetch('/api/yookassa/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function checkPaymentStatus(paymentId: string) {
  const response = await fetch(`/api/yookassa/payments/${paymentId}`);
  return response.json();
}
```

### 4. Серверная часть (Edge Functions)

Создайте Supabase Edge Function:

```typescript
// supabase/functions/yookassa-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method === 'POST') {
    const body = await req.json();
    
    // Проверка подписи
    const signature = req.headers.get('Authorization');
    // ... логика проверки подписи
    
    // Обновление статуса заказа
    if (body.event === 'payment.succeeded') {
      // Обновить статус заказа в базе данных
    }
  }
  
  return new Response('OK');
});
```

---

## 🔧 Дополнительные настройки

### 1. Настройка домена

1. Купите домен для фростcode
2. Настройте DNS записи на ваш хостинг
3. Настройте SSL сертификат

### 2. Мониторинг и аналитика

```javascript
// Подключение Google Analytics
gtag('config', 'GA_MEASUREMENT_ID');

// Отслеживание покупок
gtag('event', 'purchase', {
  'transaction_id': orderId,
  'value': amount,
  'currency': 'RUB'
});
```

### 3. Резервное копирование

```bash
#!/bin/bash
# Скрипт ежедневного бэкапа
pg_dump -h supabase-host -U postgres -d postgres > backup_$(date +%Y%m%d).sql
aws s3 cp backup_$(date +%Y%m%d).sql s3://your-backup-bucket/
```

---

## 📞 Контактная информация

- **Telegram менеджер**: [@frostmeneger](https://t.me/frostmeneger)
- **Telegram канал**: [@frostcode](https://t.me/frostcode)

---

## ⚠️ Важные замечания

1. **Безопасность**: Никогда не храните секретные ключи в коде
2. **Тестирование**: Обязательно протестируйте все платежи в тестовой среде
3. **Мониторинг**: Настройте уведомления об ошибках и сбоях
4. **Backup**: Регулярно создавайте резервные копии
5. **SSL**: Используйте только HTTPS для обработки платежей

### Чек-лист переноса

- [ ] База данных перенесена и работает
- [ ] Сайт развернут на новом хостинге
- [ ] ЮKassa настроена и протестирована
- [ ] Webhook'и работают корректно
- [ ] SSL сертификат установлен
- [ ] DNS записи настроены
- [ ] Мониторинг подключен
- [ ] Резервное копирование настроено

---

**Готово!** ✅ Ваш интернет-магазин фростcode полностью перенесен и готов к работе.