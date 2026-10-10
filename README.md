# Crud —  интернет-магазин для QA и AQA

Next.js + Ant Design + Postgres. Порт 3015.

## Запуск в Docker (app + db)

```bash
docker compose up --build -d
docker compose exec app wget -qO- --post-data='' http://localhost:3000/api/test/reset
# открыть http://localhost:3015
```

## Запуск через `npm run dev` (только БД в Docker)

```bash
docker compose up db -d          # только Postgres на localhost:5432
cp -n .env.example .env || true  # DATABASE_URL уже указывает на localhost
npm install
npm run dev                      # http://localhost:3015
npm run db:reset                 # сброс БД к сидам
```

(`npm start` без параметров слушает 3000 — внутри Docker это учтено
маппингом `3015:3000`. Локально для prod-режима: `npm start -- -p 3015`.)

Сброс БД: POST /api/test/reset. data-testid на всех элементах.

Админка `/admin` защищена: middleware проверяет JWT-сессию и роль `admin`,
неавторизованных редиректит на `/login?next=/admin`. Пункт меню «Админка»
виден только администратору.

Заказы приватные: `GET /api/orders` требует логина — обычный пользователь
видит только свои заказы, admin — последние 20 всех. Без логина `/orders`
показывает промпт входа.
