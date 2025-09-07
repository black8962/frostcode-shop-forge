# Руководство по переносу фросткод на хостинг

## Перенос проекта на хостинг

### 1. Подготовка проекта к деплою

#### Сборка проекта
```bash
npm run build
# или
yarn build
```

Это создаст папку `dist` с готовыми файлами для хостинга.

### 2. Выбор хостинга

#### Рекомендуемые варианты:

**Vercel (Бесплатно + платные планы)**
- Автоматический деплой из GitHub
- Serverless функции
- Глобальный CDN
- SSL сертификаты

**Netlify (Бесплатно + платные планы)**
- Простой деплой drag&drop
- Формы и функции
- Branch previews
- Автоматический HTTPS

**Хостинг-провайдеры России:**
- Reg.ru
- Timeweb
- Beget
- FirstVDS

### 3. Деплой на Vercel

1. Создайте аккаунт на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий
3. Укажите настройки сборки:
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
4. Добавьте переменные окружения в настройках проекта

### 4. Деплой на Netlify

1. Зайдите на [netlify.com](https://netlify.com)
2. Перетащите папку `dist` в область загрузки
3. Или подключите GitHub для автоматических обновлений
4. Настройте переменные окружения

### 5. Деплой на обычный хостинг

1. Загрузите содержимое папки `dist` в корневую папку сайта
2. Убедитесь, что сервер настроен для SPA:
   ```apache
   # .htaccess для Apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

   ```nginx
   # Nginx конфигурация
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

## Настройка домена

### 1. Покупка домена
- Reg.ru, Timeweb, Namecheap, GoDaddy
- Рекомендуем домен .ru или .com

### 2. Настройка DNS
```
A record: @ -> IP адрес хостинга
CNAME record: www -> ваш-домен.ru
```

### 3. SSL сертификат
Большинство современных хостингов предоставляют бесплатные SSL сертификаты Let's Encrypt.

## Перенос базы данных Supabase

### 1. Экспорт данных из текущего проекта

```sql
-- Экспорт структуры таблиц
pg_dump -h db.sstzbgdulvizfsuzorwf.supabase.co -U postgres -s database_name > schema.sql

-- Экспорт данных
pg_dump -h db.sstzbgdulvizfsuzorwf.supabase.co -U postgres --data-only database_name > data.sql
```

### 2. Создание нового Supabase проекта

1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Запомните новые URL и ключи

### 3. Импорт схемы и данных

```sql
-- Импорт схемы
psql -h your-new-project.supabase.co -U postgres -d postgres < schema.sql

-- Импорт данных
psql -h your-new-project.supabase.co -U postgres -d postgres < data.sql
```

### 4. Альтернативный способ - SQL Editor

1. Откройте SQL Editor в новом проекте
2. Скопируйте и выполните SQL команды из старого проекта:
   - Создание таблиц
   - Политики RLS
   - Функции и триггеры

### 5. Обновление конфигурации

Обновите файлы с новыми данными Supabase:

```typescript
// src/integrations/supabase/client.ts
const supabaseUrl = "https://your-new-project.supabase.co"
const supabaseKey = "your-new-anon-key"
```

```toml
# supabase/config.toml
project_id = "your-new-project-id"
```

## Переменные окружения для продакшена

### Для Vercel/Netlify:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Для обычного хостинга:
Создайте файл `.env.production`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Настройка Edge Functions

### 1. Деплой функций
```bash
npx supabase functions deploy --project-ref your-new-project-id
```

### 2. Настройка секретов
```bash
npx supabase secrets set YOUKASSA_SHOP_ID=your_shop_id --project-ref your-new-project-id
npx supabase secrets set YOUKASSA_SECRET_KEY=your_secret_key --project-ref your-new-project-id
```

## Тестирование после переноса

### Чеклист:
- [ ] Сайт открывается по домену
- [ ] SSL сертификат работает
- [ ] Все страницы загружаются
- [ ] Поиск функционирует
- [ ] Корзина работает
- [ ] Подключение к базе данных
- [ ] Аутентификация (если есть)
- [ ] Edge Functions отвечают
- [ ] Уведомления и email работают

### Инструменты для тестирования:
- Google PageSpeed Insights
- GTmetrix
- Lighthouse в браузере
- Консоль разработчика

## Мониторинг и аналитика

### Рекомендуемые сервисы:
- Google Analytics 4
- Yandex.Metrica
- Sentry для отслеживания ошибок
- Supabase Dashboard для мониторинга БД

### Настройка в проекте:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- Yandex.Metrica -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){
     // код метрики
   });
</script>
```

## Резервное копирование

### Автоматические бэкапы Supabase:
- Ежедневные бэкапы включены по умолчанию
- Настройка периодичности в дашборде

### Бэкап файлов сайта:
```bash
# Создание архива
tar -czf site-backup-$(date +%Y%m%d).tar.gz dist/

# Загрузка на облачное хранилище
# Настройте автоматическую загрузку на Yandex.Disk, Google Drive и т.д.
```

## Поддержка и обновления

### Настройка CI/CD:
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### Обновление зависимостей:
```bash
# Проверка устаревших пакетов
npm outdated

# Обновление
npm update

# Аудит безопасности
npm audit fix
```

## Контакты технической поддержки

- **Vercel**: support@vercel.com
- **Netlify**: support@netlify.com  
- **Supabase**: support@supabase.com
- **Telegram менеджер фросткод**: @frostmeneger

---

*Данное руководство покрывает основные аспекты переноса. При возникновении специфических вопросов обращайтесь к документации выбранного хостинга или к техподдержке.*