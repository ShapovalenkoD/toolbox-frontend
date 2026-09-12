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
            └── cardProfile/
                ├── index.ts
                ├── CardProfile.tsx
                ├── CardProfile.types.ts
                └── cardProfile.module.css
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

- **Назначение**: единственный слой, взаимодействующий с внешним миром (HTTP, storage, cookies). Инкапсулирует все side-effects.
- **Правило**: `services/` не знает о UI, store, компонентах. Возвращает данные — кто вызывает решает, куда их положить.

### Варианты API-слоя

На старте проекта выбрать **один** вариант и зафиксировать в документации.

#### Вариант А — ручная реализация

```
services/
  ├── api/
  │   ├── client.ts              # Инстанс HTTP-клиента + конфигурация
  │   ├── interceptors/
  │   │   ├── auth.ts            # Подстановка токена
  │   │   ├── errorHandler.ts    # Глобальная обработка ошибок
  │   │   └── retry.ts           # Политика повторных запросов
  │   ├── auth/
  │   │   ├── login.ts
  │   │   └── logout.ts
  │   └── user/
  │       └── getUser.ts
  ├── localStorage/
  │   └── authStorage.ts
  ├── cookies/
  │   └── sessionCookie.ts
  └── types/
      ├── request.types.ts       # Типы запросов (DTO)
      ├── response.types.ts      # Типы ответов (DTO)
      └── error.types.ts         # Типы ошибок API
```

#### Вариант Б — автогенерация (codegen)

```
services/
  ├── api/
  │   ├── client.ts              # Инстанс HTTP-клиента + конфигурация
  │   ├── interceptors/
  │   │   ├── auth.ts
  │   │   ├── errorHandler.ts
  │   │   └── retry.ts
  │   ├── generated/             # .gitignore — автогенерированный код
  │   ├── schemas/               # OpenAPI/Swagger схемы
  │   │   └── user.schema.ts
  │   └── endpoints/             # Ручные эндпоинты (поверх codegen или без схемы)
  │       └── externalApi.ts
  ├── localStorage/
  │   └── authStorage.ts
  ├── cookies/
  │   └── sessionCookie.ts
  └── types/
      ├── request.types.ts
      ├── response.types.ts
      └── error.types.ts
```

### API-клиент — контракт реализации

`client.ts` — точка входа в HTTP-слой. Независимо от выбранной библиотеки (axios, ky, fetch wrapper и т.д.), клиент **должен** реализовать следующий контракт:

```ts
// services/api/client.ts — пример интерфейса (не конкретная реализация)

interface ApiClient {
  get<T>(url: string, params?: RequestParams): Promise<T>;
  post<T>(url: string, body?: unknown): Promise<T>;
  put<T>(url: string, body?: unknown): Promise<T>;
  patch<T>(url: string, body?: unknown): Promise<T>;
  delete<T>(url: string): Promise<T>;
}
```

### Конфигурация клиента

| Параметр | Откуда берётся | Описание |
|---|---|---|
| Base URL | env-переменная (`VITE_API_URL` / `NEXT_PUBLIC_API_URL` и т.д.) | Не захардкожен в коде |
| Timeout | константа в `client.ts` (по умолчанию 30 сек) | Меняется per-request при необходимости |
| Заголовки по умолчанию | `client.ts` | `Content-Type: application/json`, `Accept: application/json` |

### Interceptors — жизненный цикл запроса

```
Request pipeline:
  [1] auth.ts        → подставить токен в заголовки
  [2] (запрос уходит)
  [3] errorHandler.ts → обработать ошибку (глобально)
  [4] retry.ts        → повторить при 429/503/network error
  [5] (ответ возвращается вызывающему коду)
```

**auth.ts** — контракт:
- Читает токен из `services/storage` (localStorage/cookie)
- Подставляет в `Authorization: Bearer {token}`
- При 401 → обновляет токен (refresh token flow) или редиректит на логин
- Не содержит бизнес-логику, только механику токена

**errorHandler.ts** — контракт:
- Маппит HTTP-статус-коды в типизированные ошибки приложения
- 400 → `ValidationError` (с телом ошибки от сервера)
- 401 → `UnauthorizedError` (trigger logout)
- 403 → `ForbiddenError`
- 404 → `NotFoundError`
- 500+ → `ServerError`
- Network error → `NetworkError`
- Все ошибки реализуют общий интерфейс `AppError`

**retry.ts** — контракт:
- Повторяет запрос при: network error, 429 (rate limit), 503 (unavailable)
- **Не повторяет** при: 400, 401, 403, 404 (это не transient ошибки)
- Стратегия: exponential backoff (1s → 2s → 4s)
- Максимум попыток: 3
- При 429 учитывает `Retry-After` заголовок

### Обработка ошибок — типизация

```ts
// services/types/error.types.ts — пример

interface AppError {
  code: ErrorCode;
  message: string;
  status?: number;        // HTTP-статус (если HTTP-ошибка)
  details?: unknown;      // Тело ошибки от сервера (validation errors и т.д.)
  isRetryable: boolean;   // Можно ли повторить запрос
}

type ErrorCode =
  | 'NETWORK_ERROR'       // Нет соединения
  | 'TIMEOUT'             // Таймаут запроса
  | 'UNAUTHORIZED'        // 401
  | 'FORBIDDEN'           // 403
  | 'NOT_FOUND'           // 404
  | 'VALIDATION'          // 400 — ошибка валидации от сервера
  | 'SERVER'              // 500+
  | 'UNKNOWN';            // Всё остальное
```

### DTO vs бизнес-модели

| Уровень | Где живёт | Что это | Пример |
|---|---|---|---|
| DTO (request) | `services/types/request.types.ts` | Тело запроса к API | `{ email: string; password: string }` |
| DTO (response) | `services/types/response.types.ts` | Тело ответа от API | `{ id: number; first_name: string; created_at: string }` |
| Бизнес-модель | `lib/domain/` или `store/*/types` | Модель после маппинга | `{ id: string; firstName: string; createdAt: Date }` |

**Правило**: компоненты и store **никогда** не работают с DTO напрямую. Между DTO и бизнес-моделью — конвертер:

```ts
// lib/domain/api/userConverter.ts

export const userFromDto = (dto: UserResponseDto): User => ({
  id: String(dto.id),
  firstName: dto.first_name,
  createdAt: new Date(dto.created_at),
});
```

### Endpoint-функции — контракт

Каждый endpoint — отдельная функция, возвращающая `Promise<T>`:

```ts
// services/api/user/getUser.ts

export const getUser = (id: string): Promise<UserResponseDto> =>
  client.get(`/users/${id}`);
```

**Правила**:
- Endpoint возвращает **DTO**, не бизнес-модель
- Конвертацию делает вызывающий код (store/hook/component)
- Каждый endpoint — одна функция, один файл (или несколько мелких в одном файле, если они связаны)
- Никакой бизнес-логики в endpoint-функциях — только вызов клиента с параметрами

### Правила слоя services

- `services/` не импортирует из `components/`, `store/`, `app/`
- `services/` может импортировать из `lib/` (утилиты, типы)
- Endpoint-функции возвращают DTO, не бизнес-модели
- Токен-менеджмент живёт в `services/`, не в store
- Все env-переменные типизированы и читаются через `config/env.ts` (не напрямую из `process.env`)

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

## File Naming Convention

| Тип файла | Формат | Пример |
|---|---|---|
| Папка компонента/утилиты | `camelCase/` | `productCard/`, `radioGroup/` |
| React-компонент | `PascalCase.tsx` | `ProductCard.tsx` |
| Хук (привязан к компоненту) | `*.hooks.ts` | `ProductCard.hooks.ts` |
| Утилита | `camelCase.ts` | `formatPrice.ts` |
| Типы/интерфейсы (рядом с файлом) | `*.types.ts` | `ProductCard.types.ts` |
| Константы | `*.constants.ts` | `routes.constants.ts` |
| CSS Module | `*.module.css` | `productCard.module.css` |
| Тест | `*.test.tsx` / `*.test.ts` | `ProductCard.test.tsx` |
| Story | `*.stories.tsx` | `ProductCard.stories.tsx` |
| Мок | `*.mock.ts` | `userApi.mock.ts` |
| Barrel-экспорт | `index.ts` | В каждой папке |

**Правила**:
- Один React-компонент на файл
- Только именованный экспорт (`export default` запрещён)
- Barrel-экспорт (`index.ts`) в каждой папке
- Типы рядом с файлом: `ProductCard.types.ts` рядом с `ProductCard.tsx`
- Хуки рядом с компонентом: `ProductCard.hooks.ts` рядом с `ProductCard.tsx`
- Если типы общие для нескольких файлов — в общей папке `types/` модуля

**Пример структуры компонента**:
```
productCard/
├── index.ts                  # barrel-экспорт
├── ProductCard.tsx           # компонент
├── ProductCard.hooks.ts      # хуки компонента
├── ProductCard.types.ts      # типы пропсов и внутренние типы
├── ProductCard.test.tsx      # тесты
├── ProductCard.stories.tsx   # storybook
└── productCard.module.css    # стили
```

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
    │   ├── index.ts
    │   ├── Button.tsx
    │   ├── Button.hooks.ts
    │   └── Button.types.ts
    ├── input/
    │   ├── index.ts
    │   ├── Input.tsx
    │   ├── Input.hooks.ts
    │   └── Input.types.ts
    └── icons/
        ├── index.ts
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
    │   ├── index.ts
    │   ├── RadioGroup.tsx
    │   ├── RadioGroup.types.ts
    │   └── radioGroup.module.css
    ├── loadingButton/
    │   ├── index.ts
    │   ├── LoadingButton.tsx
    │   ├── LoadingButton.types.ts
    │   └── loadingButton.module.css
    └── alert/
        ├── index.ts
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
        ├── index.ts
        ├── Carousel.tsx
        ├── Carousel.hooks.ts
        ├── Carousel.types.ts
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
    │   ├── index.ts
    │   ├── MainLayout.tsx
    │   └── CardLayout.tsx
    └── card/
        └── product/
            ├── index.ts
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
        ├── index.ts
        ├── Card.tsx
        ├── Card.types.ts
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
    │       ├── index.ts
    │       ├── ProductCard.tsx
    │       ├── ProductCard.hooks.ts
    │       └── ProductCard.types.ts
    └── table/
        └── columns/
            └── product/
                ├── index.ts
                ├── nameProductColumnTable.tsx
                └── priceProductColumnTable.tsx
  ```

---

## Storybook

- **Назначение**: визуальная документация UI-кита. Storybook — единственный источник правды о том, как выглядит и ведёт себя каждый UI-компонент.
- **Расположение**: stories живут **рядом с компонентом** (не в отдельной папке):
  ```
  button/
    ├── index.ts
    ├── Button.tsx
    ├── Button.types.ts
    ├── Button.hooks.ts
    └── Button.stories.tsx     # ← здесь
  ```

### Какие компоненты **обязаны** иметь story

| Слой | Story обязателен | Причина |
|---|---|---|
| `ui/atoms/` | Да | Базовые строительные блоки, должны быть задокументированы |
| `ui/molecules/` | Да | Переиспользуемые композиции, разработчики должны видеть все состояния |
| `ui/organisms/` | Да | Сложные блоки, требуют интерактивной демонстрации |
| `business/layouts/` | Опционально | Макеты без логики, story полезна для визуальной проверки |
| `business/patterns/` | Опционально | Шаблонные компоненты с большим количеством конфигураций |
| `business/features/` | Нет | Содержат бизнес-логику и привязку к store — сложно изолировать |

### Структура story-файла

```tsx
// components/ui/atoms/button/Button.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select' },
    size: { control: 'select' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Состояние по умолчанию
export const Default: Story = {
  args: {
    children: 'Нажми меня',
  },
};

// Все варианты
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

// Состояния
export const Disabled: Story = {
  args: {
    children: 'Неактивна',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Загрузка',
    loading: true,
  },
};
```

### Правила

- **Один story-файл на компонент**: `Button.stories.tsx` — не `Button.variants.stories.tsx` + `Button.states.stories.tsx`
- **`tags: ['autodocs']`**: обязателен — генерирует автоматическую документацию из TypeScript-типов
- **`argTypes`**: описывать для всех пропсов с ограниченным набором значений (`select`, `boolean`, `radio`)
- **Stories как функции**: `render` для составных демонстраций (несколько вариантов рядом), `args` для простых состояний
- **Naming экспорта**: `PascalCase`, на русском или английском — зависит от проекта, но единообразно. `Default` — обязательная story (отображается по умолчанию)
- **Изоляция**: story не должна зависеть от `store/`, `services/`, роутера. Если компоненту нужен провайдер — оборачивать в story через `decorators`
- **Mock-данные**: использовать инлайн-данные, не импортировать из `mocks/`. Story должна быть самодостаточной

### Storybook-таксономия (структура sidebar)

```
UI/
  Atoms/
    Button
    Input
    Icon
  Molecules/
    RadioGroup
    LoadingButton
    Alert
  Organisms/
    Carousel
  Foundation/
    Palette
    Typography
Business/
  Layouts/
    MainLayout
  Patterns/
    Card
```

Структура sidebar задаётся через `title` в meta:
```ts
// title формирует путь в sidebar: "UI/Atoms/Button"
const meta: Meta<typeof Button> = {
  title: 'UI/Atoms/Button',
  // ...
};
```

### Что story демонстрирует для каждого компонента

| Обязательно | Желательно |
|---|---|
| Default (состояние по умолчанию) | Все варианты (`variant`, `size`) рядом |
| Все значения enum-пропсов | Loading/Disabled состояния |
| | Edge cases (длинный текст, пустое содержимое) |
| | Адаптив (через toolbar viewport) |
