# AI Rules

Этот файл — инструкция для ИИ-агента. Скопируй его вместе с `ProjectStructure.md` в новый проект.

## Как пользоваться

1. `ProjectStructure.md` — полная документация: структура папок, примеры, контракты, Storybook.
2. Этот файл — быстрые правила, которые нужно соблюдать при работе с кодом.

## Общие правила

- Зависимости **только вниз**: `app → components → store → services → lib`
- Только **именованный экспорт** (`export default` запрещён)
- Barrel-экспорт (`index.ts`) в каждой папке: только публичный API
- Доверяем контрактам с бэкендом — клиентская валидация только при явном требовании
- Названия файлов: `camelCase` папки, `PascalCase` компоненты, `camelCase` утилиты

## По слоям

### `app/`
- Провайдеры, роутинг, страницы. **Не содержит** конфигурацию store.
- Компоненты только для 1 страницы → `/_components`. Переиспользуемые → `components/`.
- Подробнее: `./app/rules.md`

### `components/ui/`
- UI-кит без бизнес-логики: `foundation`, `atoms`, `molecules`, `organisms`.
- **Не импортирует** `store/`, `services/`, `components/business/`.
- Story обязателен для atoms, molecules, organisms.
- Подробнее: `./components/ui/rules.md`

### `components/business/`
- `layouts/` — макеты без логики.
- `patterns/` — props-driven, **запрещён** импорт `store/` и `services/`. Данные только через пропсы.
- `features/` — бизнес-логика, **обязателен** импорт `store/` или `services/`.
- Граница: нет импорта store/services → pattern. Есть → features.
- Подробнее: `./components/business/rules.md`

### `services/`
- Единственный слой с side-effects: HTTP, localStorage, cookies.
- **Не импортирует** `components/`, `store/`, `app/`.
- Endpoint-функции возвращают **DTO**, не бизнес-модели.
- Конвертацию делает вызывающий код, конвертер рядом с ним.
- Подробнее: `./services/rules.md`

### `store/`
- **Не импортирует** `components/`, `services/`, `app/`.
- Хранит только **бизнес-модели**, никогда DTO.
- Async-логика живёт в store, не в компонентах.
- Подробнее: `./store/rules.md`

### `lib/`
- Чистые утилиты без side-effects. **Не импортирует** `services/`, `store/`, `components/`.
- `hooks/` — переиспользуемые хуки (2+ мест). Хук для 1 места → рядом с компонентом.
- `business/formatters/` — Zod-схемы для полей форм (дата, деньги, числа), маски ввода.
- `utils/` — чистые функции без контекста проекта.
- Подробнее: `./lib/rules.md`

### `constants/`
- Листовой узел. Только примитивы, без side-effects. **Не импортирует** ничего.
- Подробнее: `./constants/rules.md`

### `mocks/`
- Только для тестов и stories. Запрещён импорт в рабочий код.
- Подробнее: `./mocks/rules.md`

### `config/`
- Типизированный доступ к env и feature flags. Весь проект импортирует env через `config/env.ts`.
- Подробнее: `./config/rules.md`

### `assets/`
- Статика: изображения, шрифты, SVG. Именование `kebab-case`.
- Подробнее: `./assets/rules.md`

## Запреты (сводная таблица)

| Слой | Нельзя импортировать |
|---|---|
| `lib/` | `services/`, `store/`, `components/` |
| `components/ui/` | `services/`, `store/`, `components/business/` |
| `services/` | `components/`, `store/`, `app/` |
| `store/` | `components/`, `services/`, `app/` |
| `constants/` | `services/`, `store/`, `components/`, `lib/` |
| `mocks/` | `services/`, `store/`, `components/`, `lib/`, `app/` |

## Валидация

| Тип | Где живёт | Когда |
|---|---|---|
| Валидация ответов API | `services/api/[domain]/[name].schema.ts` | Только при явном требовании |
| Валидация полей форм | `lib/business/formatters/` | Zod-схемы: дата, деньги, числа |
| По умолчанию | — | Доверяем контрактам бэкенда |

## Детальные правила по слоям

| Слой | Путь |
|---|---|
| app | `./app/rules.md` |
| components/ui | `./components/ui/rules.md` |
| components/business | `./components/business/rules.md` |
| services | `./services/rules.md` |
| store | `./store/rules.md` |
| lib | `./lib/rules.md` |
| config | `./config/rules.md` |
| constants | `./constants/rules.md` |
| mocks | `./mocks/rules.md` |
| assets | `./assets/rules.md` |
