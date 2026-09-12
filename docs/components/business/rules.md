# components/business/ — Правила

## Что это
Бизнес-компоненты. Импортируют из `store/` и `services/`.

## Структура
```
business/
  ├── layouts/       # Макеты без логики
  ├── patterns/      # Шаблонные компоненты (props-driven)
  └── features/      # Компоненты с бизнес-логикой
```

## Формальная граница: patterns vs features
| Критерий | `patterns/` | `features/` |
|---|---|---|
| Импорт `store/` | **Запрещён** | **Обязателен** |
| Импорт `services/` | **Запрещён** | **Допускается** |
| Источник данных | Только `props` | Store, context, services |
| Storybook | Обязателен | Опционально |

**Правило**: нет импорта store/services → pattern. Есть → features.

## Нельзя
- Класть в `patterns/` компонент с импортом из `store/` или `services/`.
- Создавать вложенность глубже 3 уровней от корня `components/`.
- Класть UI-only компоненты в `business/`.
