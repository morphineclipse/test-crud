# Crud — гайд тестировщика

> Тестовые доступы продублированы в `CREDENTIALS.md` (на сайте они не публикуются).

Учебный мини-шоп для manual + automated. Next.js (Ant Design) + Postgres, порт 3015.

## 1. Запуск и данные

```bash
docker compose up --build -d
curl -X POST http://localhost:3015/api/test/reset
```

Локальная разработка через `npm run dev`:

```bash
docker compose up db -d   # только Postgres
cp -n .env.example .env   # DATABASE_URL уже на localhost:5432
npm install
npm run dev               # http://localhost:3015
```

- Base URL: `http://localhost:3015`
- Сброс БД к сидам: `POST /api/test/reset` (также GET, кнопка `data-testid="test-reset"` на `/test`)
- Пользователи (после reset):
  - `admin@test.com / admin123` (role=admin)
  - `user@test.com / user123` (role=user)
- Промокоды: `QA10` (-10%), `QA20` (-20%), остальное — 400
- Все интерактивные элементы имеют `data-testid` — использовать в автотестах вместо CSS/XPath.

## 2. Карта приложения

| Страница | Путь | Ключевые testid |
| --- | --- | --- |
| Главная | `/` | `home-title`, `home-cta` |
| Каталог | `/products` | `products-search`, `products-category`, `products-sort`, `products-apply`, `products-list`, `product-{id}`, `product-link-{id}`, `product-price-{id}`, `product-stock-{id}`, `product-add-{id}`, `products-prev/next`, `products-page` |
| Карточка | `/products/[id]` | `product-title`, `product-price`, `product-stock`, `product-desc`, `product-qty`, `product-add`, `product-notfound` |
| Корзина | `/cart` | `cart-title`, `cart-empty`, `cart-item-{id}`, `cart-qty-{id}`, `cart-remove-{id}`, `cart-total`, `cart-promo`, `cart-checkout`, `cart-clear` (localStorage `crud_cart`) |
| Оформление | `/checkout?promo=` | `checkout-email`, `checkout-submit`, `checkout-msg` |
| Заказы | `/orders` (требует логина: свои заказы; без логина — промпт входа) | `order-{id}` |
| Вход | `/login` (вкладки «Вход» / «Регистрация») | Вход: `login-email`, `login-password`, `login-submit`, `login-msg`; регистрация: `register-email`, `register-password`, `register-submit`, `register-msg`; общее: `logout-submit` |
| Админка | `/admin` (middleware: только role=admin, остальных редиректит на `/login?next=/admin`; без прав — `admin-denied`) | `admin-title-input`, `admin-price`, `admin-stock`, `admin-category`, `admin-description`, `admin-create`, `admin-msg`, `admin-table`, `admin-row-{id}`, `admin-delete-{id}` |
| Тест-страницы | `/test`, `/test/waits`, `/test/flaky`, `/test/alerts`, `/test/upload`, `/test/dnd`, `/test/iframe` (только по прямому URL, из шапки убраны) | см. раздел 5 |

## 3. API

### Auth

| Метод | Endpoint | Тело | Успех | Ошибки |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | `{email, password}` | 201 `{id,email,role}` + cookie | 400 email без `@` / пароль < 4; 409 email занят |
| POST | `/api/auth/login` | `{email, password}` | 200 `{id,email,role}` + cookie | 401 неверные данные |
| POST | `/api/auth/logout` | — | 200 `{ok:true}` | — |
| GET | `/api/auth/me` | cookie | 200 `{id,email,role}` | 401 без cookie |

Сессия: httpOnly cookie `crud_session` (JWT, 7d).

### Products

| Метод | Endpoint | Параметры | Успех | Ошибки |
| --- | --- | --- | --- | --- |
| GET | `/api/products?q=&cat=&sort=&page=` | `q` подстрока, `cat` tech/books/clothes/home/misc, `sort` id/price_asc/price_desc, `page` N (по 6 шт) | 200 `[{id,title,price,stock,category,description}]` | — |
| POST | `/api/products` | `{title, price, stock, category, description}`, только admin | 201 продукт | 401 без логина; 403 не admin; 400 `title min 2`, `price 0..1000000`, `stock 0..10000` |
| GET | `/api/products/[id]` | — | 200 продукт | 404 not found |
| PUT | `/api/products/[id]` | частичное `{title,price,stock,category,description}`, только admin | 200 продукт | 401/403/404 |
| DELETE | `/api/products/[id]` | только admin | 200 `{ok:true}` | 401/403 |

### Orders

| Метод | Endpoint | Тело | Успех | Ошибки |
| --- | --- | --- | --- | --- |
| GET | `/api/orders` | cookie | 200 свои заказы (admin — последние 20 всех) | 401 без логина |
| POST | `/api/orders` | `{email, promo, items:[{id,title,price,qty}]}` | 201 `{id,email,total,promo,status}` + списание stock (при логине заказ привязывается к пользователю) | 400 email без `@` / пустая корзина / `qty 1..99` / неверный промокод; 404 товар не найден; 409 недостаточно stock |

Логика total: `sum(price*qty)`, затем скидка `QA10/QA20`.

### Test helpers

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| POST/GET | `/api/test/reset` | TRUNCATE + ресид 2 юзеров + 12 товаров |
| POST | `/api/test/upload` | multipart `file` → 200 `{name,size,type}` / 400 без файла |
