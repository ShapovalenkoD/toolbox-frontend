# Структура проекта - краткая версия

- `app` - точка входа в приложение: провайдеры, роутинг, страницы. **Не содержит** конфигурацию store.
- `constants` - глобальные константы проекта (regex, роуты, общие значения).
- `mocks` - моковые данные для тестов и разработки.
  - `service` - моки API-сервисов
  - `components` - моки для пропсов компонентов
- `services` - сервисы для работы с side-effects (API, localStorage, cookie).
  - `api/[variant]` - два варианта реализации (см. полную версию)
  - `localStorage` - методы для работы с localStorage
  - `types` - общие типы для работы с services
- `store` - глобальный store. **Вся** конфигурация (rootReducer, middleware, типы) живёт здесь.
- `docs` - папка для документации проекта.
- `lib` - общие утилиты и библиотеки.
  - `hooks` - хуки проекта
  - `ts` - утилиты-дженерики для TypeScript
  - `domain` - утилиты, зависящие от бизнес-логики проекта
  - `utils` - чистые утилиты без контекста проекта
- `components` - общая папка для всех компонентов.
  - `business` - компоненты, относящиеся к бизнес-логике
    - `layouts` - композиции макетов, без логики
    - `patterns` - шаблонные компоненты с обобщённой бизнес-логикой
    - `features` - компоненты с конечной реализацией бизнес-логики
  - `ui` - общая папка для UI-кита
    - `foundation` - глобальные стилевые константы с их типами
    - `atoms` - простейшие UI-элементы
    - `molecules` - группы атомов
    - `organisms` - комплексные UI-компоненты

---

# Dependency rules — карта допустимых зависимостей

Направление стрелки: `A → B` означает "A может импортировать B".

```
app → components/business → components/ui
app → store → lib
app → services → lib
components/business → services (через хуки)
components/business → store (через селекторы)
components/ui → (только внешние библиотеки)
lib → (только внешние библиотеки)
services → lib
constants → (только внешние библиотеки)
```

**Запрещённые зависимости:**

| Кто импортирует | Кого нельзя | Причина |
|---|---|---|
| `lib/` | `services/`, `store/`, `components/` | Утилиты должны быть чистыми, без side-effects |
| `components/ui/` | `services/`, `store/`, `components/business/` | UI-кит не знает о бизнесе |
| `services/` | `components/`, `store/` | Сервисы не зависят от UI или состояния |
| `store/` | `components/`, `services/` | Стор не знает, кто его использует |
| `constants/` | `services/`, `store/`, `components/`, `lib/` | Константы — листовые узлы |

**Реализация:** `eslint-plugin-import` → правило `import/no-restricted-paths` (см. `.eslintrc`).

---

# Структура проекта - полная версия

## `app` - Точка входа приложения

- **Содержит**: провайдеры (store, router, theme), страницы проекта.
- **Не содержит**: конфигурацию store (rootReducer, middleware) — это живёт в `store/`.
- **Правила**:
  - Компоненты, используемые только на 1 странице → `/_components`
  - Переиспользуемые компоненты выносятся в `components/`
- **Пример структуры**:

  ```
  app/
    ├── App.tsx
    ├── RootProvider.tsx          # Только композиция провайдеров
    ├── app.css
    └── profilePage/
        ├── layout.tsx
        ├── page.tsx
        └── _components/
            └── CardProfile/
                ├── CardProfile.tsx
                └── CardProfile.module.css
  ```

- **RootProvider** — тривиальная обёртка:
  ```tsx
  import { Provider } from 'react-redux';
  import { store } from '@/store/store';

  export const RootProvider = ({ children }) => (
    <Provider store={store}>
      {children}
    </Provider>
  );
  ```

## `constants` - Глобальные константы приложения

- **Содержит**: только константы-примитивы и конфигурационные объекты без side-effects.
- **Не содержит**: API-константы (notification messages) — они относятся к `services/`.
- **Примеры файлов**:
  ```
  constants/
    ├── regex.ts
    └── routes.ts
  ```

## `mocks` - Моковые данные для тестов и разработки

- **Структура**:
  - `service/` - моки API-сервисов
  - `components/` - моки для пропсов компонентов
- **Пример структуры**:
  ```
  mocks/
    ├── service/
    │   └── userApi.mock.ts
    └── components/
        └── CardProfile.mock.ts
  ```

## `services` - Работа с side-эффектами

- **Структура**: два варианта API-слоя (выбирается один на старте проекта, не оба одновременно).

  ### Вариант А — ручная реализация

  ```
  services/
    ├── api/
    │   └── auth/
    │       └── login.ts
    ├── localStorage/
    │   └── authStorage.ts
    └── types/
        └── api.types.ts
  ```

  ### Вариант Б — автогенерация (codegen)

  ```
  services/
    ├── api/
    │   ├── generated/          # .gitignore — автогенерированный код
    │   ├── schemas/
    │   │   └── user.schema.ts
    │   ├── endpoints/
    │   │   └── externalApi.ts  # Ручные эндпоинты поверх codegen
    │   └── client.ts           # Конфиг API-клиента
    ├── localStorage/
    │   └── authStorage.ts
    └── types/
        └── api.types.ts
  ```

- **Правила**:
  - На старте проекта выбрать **один** вариант и зафиксировать в документации.
  - `client.ts` содержит: базовый URL, interceptors (auth token, error handling, retry).
  - `types/` — DTO для запросов/ответов, не бизнес-модели.

## `store` - Глобальный стейт-менеджмент

- **Содержит**: всю конфигурацию store — rootReducer, middleware, типы RootState/AppDispatch.
- **Пример структуры**:
  ```
  store/
    ├── store.ts              # createStore + middleware + enhancers
    ├── rootReducer.ts        # combineReducers всех слайсов
    ├── middleware.ts          # кастомные middleware (логирование и т.д.)
    ├── types.ts               # RootState, AppDispatch
    ├── user/
    │   ├── userSlice.ts
    │   └── userSelectors.ts
    └── cart/
        ├── cartSlice.ts
        └── cartSelectors.ts
  ```

## `docs` - Документация проекта

- **Пример структуры**:
  ```
  docs/
    ├── ProjectStructure.md
    ├── Development.md
    └── CodeStyleGuide.md
  ```

## `lib` - Утилиты и вспомогательные функции

- **Структура**:
  - `hooks` - хуки проекта
  - `ts` - утилиты-дженерики для TypeScript
  - `domain` - утилиты, зависящие от бизнес-логики
  - `utils` - чистые утилиты без контекста проекта

- **Пример структуры `domain/`**:
  ```
  domain/
    ├── zValidators/
    │   └── zCommon.ts           # zod-схемы для базовых кейсов
    └── api/
        └── convertToBack{NameTypeData}.ts  # конвертация данных для бэкенда
  ```

- **Пример структуры `utils/`**:
  ```
  utils/
    ├── string/                  # или string.ts — при малом количестве
    │   └── declOfNum.ts
    └── number/
        └── formatPrice.ts
  ```

- **Примеры сторонних библиотек**:
  - `ymaps` — подключение Яндекс Карт

## `components` - Компоненты приложения

- **Дизайн-система**: [Figma](https://figma.com/your-link)

  ```
  components/
    ├── ui/                      # UI-кит (без бизнес-логики)
    └── business/                # Бизнес-компоненты
  ```

### `ui/` - UI-кит

- **Правило**: не импортирует ничего из `services/`, `store/`, `components/business/`.

#### `foundation/` - Базовые стили

- **Правила**:
  - Базовые классы, определения темы и переменных, утилитарных классов
  - Tailwind слои (layer): `base`, `utils`, `theme`
- **Пример**:
  ```
  export const palette = {
    primary: '#0ea5e9',
  } as const;

  export type PaletteKey = keyof typeof palette;
  ```

#### `atoms/` - Примитивы

- **Правила**:
  - Tailwind слой: `components`
  - Утилитарные классы, помогающие основному классу (размер, вариант)
  - Возможны как CSS-классы, так и компоненты
- **Пример структуры**:
  ```
  atoms/
    ├── button/
    │   ├── Button.tsx
    │   └── button.hooks.ts
    ├── input/
    │   ├── Input.tsx
    │   └── input.hooks.ts
    └── icons/
        ├── ArrowIcon.tsx
        └── CloseIcon.tsx
  ```

#### `molecules/` - Простые композиции

- **Правила**:
  - Внутреннее состояние допускается
  - Атом с дополнительной логикой или группа атомов
- **Пример структуры**:
  ```
  molecules/
    ├── radioGroup/
    │   ├── RadioGroup.tsx
    │   └── radioGroup.module.css
    ├── loadingButton/
    │   ├── LoadingButton.tsx
    │   └── loadingButton.module.css
    └── alert/
        └── Alert.tsx
  ```

#### `organisms/` - Сложные блоки

- **Правила**:
  - Сложная UI-логика (анимации, сложные взаимодействия)
  - Допускается использование UI-библиотек (Swiper, Recharts и т.д.)
- **Пример структуры**:
  ```
  organisms/
    └── carousel/
        ├── Carousel.tsx
        └── carousel.module.css
  ```

### `business/` - Бизнес-компоненты

- **Правило**: может импортировать из `services/` (через хуки) и `store/` (через селекторы).

#### `layouts/` - Композиции макетов

- **Правила**:
  - Компоненты отвечают за отрисовку макетов
  - Без бизнес-логики
  - Переиспользуются в pages/features/patterns
  - Медиа-запросы для адаптива
- **Пример структуры**:
  ```
  layouts/
    ├── main/
    │   ├── MainLayout.tsx
    │   └── CardLayout.tsx
    └── card/
        └── product/
            ├── ProductCardLayout.tsx
            └── productCardLayout.module.css
  ```

#### `patterns/` - Шаблонные компоненты с обобщённой бизнес-логикой

- **Правила**:
  - Не имеют конечной бизнес-логики
  - Без внешних провайдеров данных
  - Большое количество конфигураций (props-driven)
  - Переиспользуются в pages/features
  - **Запрещены side-effects и обращения к API напрямую** — данные передаются через пропсы или хуки-аргументы
- **Пример структуры**:
  ```
  patterns/
    └── card/
        ├── Card.tsx
        └── card.module.css
  ```

#### `features/` - Компоненты с конечной бизнес-логикой

- **Правила**:
  - Обязательно имеют конечную реализацию бизнес-логики
  - Минимальное количество конфигураций (только визуальные: `getName`, `className`)
  - Переиспользуются в pages
  - Группировка: сначала по общему домену, потом по бизнес-домену
  - Интеграция с внешними провайдерами данных (context/store) допускается
- **Пример структуры**:
  ```
  features/
    ├── cards/
    │   └── productCard/
    │       ├── ProductCard.tsx
    │       └── ProductCard.hooks.ts
    └── table/
        └── columns/
            └── product/
                ├── nameProductColumnTable.tsx
                └── priceProductColumnTable.tsx
  ```
