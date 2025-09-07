# Интеграция с ЮКасса для фросткод

## Пошаговая инструкция по настройке оплаты

### 1. Регистрация в ЮКасса

1. Зарегистрируйтесь на [yookassa.ru](https://yookassa.ru)
2. Пройдите модерацию и подключите нужные методы оплаты
3. Получите ваши API ключи в личном кабинете

### 2. Настройка Supabase Edge Function для ЮКасса

```typescript
// supabase/functions/create-payment/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { amount, currency, description, orderId } = await req.json();
  
  const shopId = Deno.env.get('YOUKASSA_SHOP_ID');
  const secretKey = Deno.env.get('YOUKASSA_SECRET_KEY');
  
  const payment = {
    amount: {
      value: amount,
      currency: currency || 'RUB'
    },
    confirmation: {
      type: 'redirect',
      return_url: `${Deno.env.get('SITE_URL')}/payment-success`
    },
    capture: true,
    description: description,
    metadata: {
      order_id: orderId
    }
  };

  const response = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotence-Key': crypto.randomUUID(),
      'Authorization': `Basic ${btoa(`${shopId}:${secretKey}`)}`
    },
    body: JSON.stringify(payment)
  });

  const result = await response.json();
  
  return new Response(
    JSON.stringify(result),
    { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  );
});
```

### 3. Настройка секретов в Supabase

Добавьте в настройках Edge Functions:
- `YOUKASSA_SHOP_ID` - ID вашего магазина
- `YOUKASSA_SECRET_KEY` - секретный ключ
- `SITE_URL` - URL вашего сайта

### 4. Создание таблицы заказов

```sql
-- Создание таблицы заказов
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_id TEXT,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включение RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Политики доступа
CREATE POLICY "Пользователи видят свои заказы" 
ON orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Пользователи создают свои заказы" 
ON orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

### 5. Интеграция в React компоненты

```tsx
// Функция создания платежа
const createPayment = async (cartItems: any[], totalAmount: number) => {
  const { data, error } = await supabase.functions.invoke('create-payment', {
    body: {
      amount: totalAmount.toFixed(2),
      currency: 'RUB',
      description: `Заказ в фросткод`,
      orderId: `order_${Date.now()}`
    }
  });

  if (error) {
    console.error('Ошибка создания платежа:', error);
    return;
  }

  // Сохранение заказа в базу
  const { error: orderError } = await supabase
    .from('orders')
    .insert({
      total_amount: totalAmount,
      payment_id: data.id,
      items: cartItems,
      status: 'pending'
    });

  if (orderError) {
    console.error('Ошибка сохранения заказа:', orderError);
    return;
  }

  // Перенаправление на страницу оплаты
  window.location.href = data.confirmation.confirmation_url;
};

// Компонент корзины с кнопкой оплаты
const Cart = ({ items }: { items: CartItem[] }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.name} - {item.price}₽ x {item.quantity}
        </div>
      ))}
      <div>Итого: {total}₽</div>
      <Button onClick={() => createPayment(items, total)}>
        Оплатить через ЮКасса
      </Button>
    </div>
  );
};
```

### 6. Обработка уведомлений (Webhook)

```typescript
// supabase/functions/payment-webhook/index.ts
serve(async (req) => {
  const webhook = await req.json();
  
  if (webhook.event === 'payment.succeeded') {
    const paymentId = webhook.object.id;
    
    // Обновление статуса заказа
    const { error } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('payment_id', paymentId);
      
    if (error) {
      console.error('Ошибка обновления заказа:', error);
    }
  }

  return new Response('OK');
});
```

### 7. Страницы успеха и ошибки

Создайте страницы:
- `/payment-success` - успешная оплата
- `/payment-error` - ошибка оплаты

### 8. Настройка в ЮКасса

В личном кабинете ЮКасса укажите:
- URL для уведомлений: `https://your-project.supabase.co/functions/v1/payment-webhook`
- Методы оплаты: банковские карты, SberPay, ЮMoney и др.

### 9. Тестирование

Используйте тестовые данные:
- Номер карты: 5555 5555 5555 4444
- Срок: любой в будущем
- CVC: любой

### 10. Дополнительные возможности

- Возвраты платежей
- Рекуррентные платежи
- Разделение платежей
- Аналитика и отчеты

## Контакты для поддержки

- Документация ЮКасса: [yookassa.ru/developers](https://yookassa.ru/developers)
- Техническая поддержка: support@yookassa.ru
- Telegram менеджер фросткод: @frostmeneger