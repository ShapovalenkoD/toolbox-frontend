# app/ — Правила

## Что это
Точка входа в приложение: провайдеры, роутинг, страницы.

## Структура
```
app/
  ├── App.tsx
  ├── RootProvider.tsx        # Композиция провайдеров (store, router, theme)
  ├── routes.tsx              # Конфигурация роутов (config-based)
  ├── guards/                 # AuthGuard, RoleGuard
  └── pages/
      └── [name]/
          ├── page.tsx
          ├── layout.tsx
          └── _components/    # Компоненты только этой страницы
```

## Правила
- **Не содержит** конфигурацию store (rootReducer, middleware) → это в `store/`.
- Компоненты только для 1 страницы → `/_components`. Переиспользуемые → `components/`.
- Страницы загружаются **лениво** (dynamic import + fallback).
- Guards — отдельные компоненты в `app/guards/`.

## Routing
На старте выбрать **один** подход:
- **Config-based** — массив роутов в `app/routes.ts`.
- **File-based** — структура папок = структура URL.

## Нельзя
- Класть переиспользуемые компоненты в `_components/`.
- Хранить конфигурацию store в `app/`.
- Класть бизнес-логику в провайдеры.
