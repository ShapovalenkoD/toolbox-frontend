# services/ — Правила

## Что это
Единственный слой с side-effects: HTTP, localStorage, cookies.

## Структура
```
services/
  ├── api/
  │   ├── client.ts           # HTTP-клиент + конфигурация
  │   ├── interceptors/       # auth.ts, errorHandler.ts, retry.ts
  │   └── [domain]/           # Endpoint-функции
  ├── localStorage/
  ├── cookies/
  └── types/                  # DTO (request/response), типы ошибок
```

## Правила
- **Не импортирует** из `components/`, `store/`, `app/`.
- Endpoint-функции возвращают **DTO**, не бизнес-модели.
- Конвертацию делает вызывающий код, конвертер рядом с ним.
- Токен-менеджмент живёт в `services/`, не в store.
- Никакой бизнес-логики в endpoint-функциях.

## Валидация ответов API
Схемы живут **рядом с endpoint**: `login.schema.ts` рядом с `login.ts`. Только при явном требовании.

## Нельзя
- Импортировать `components/`, `store/`, `app/`.
- Возвращать бизнес-модели из endpoint-функций.
- Читать `process.env` напрямую → только через `config/env.ts`.
