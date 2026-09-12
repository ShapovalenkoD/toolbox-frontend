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
- `assets` - статические ресурсы (изображения, шрифты, SVG-иконки).
- `docs` - папка для документации проекта.
- `config` - конфигурация приложения (env-переменные, feature flags).
- `lib` - общие утилиты и библиотеки.
  - `hooks` - хуки проекта
  - `ts` - утилиты-дженерики для TypeScript
  - `business` - утилиты, зависящие от бизнес-логики проекта
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
| `mocks/` | `services/`, `store/`, `components/`, `lib/`, `app/` | Моки только для тестов и stories, запрещён импорт в рабочий код |

**Реализация:** правило линтера `import/no-restricted-paths` (или аналог) для автоматической проверки границ зависимостей.

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

- **RootProvider** — тривиальная обёртка, композиция всех провайдеров приложения (store, router, theme и т.д.). Не содержит бизнес-логики.

### Routing

- **Стратегия**: выбрать один подход на старте проекта:
  - **Config-based** — массив роутов в `app/routes.ts` / `app/router.ts`
  - **File-based** — структура папок = структура URL (Next.js-style)
- **Lazy loading**: страницы загружаются отложено (dynamic import + fallback)
- **Guards**: защита роутов (авторизация, роли) — отдельный компонент `AuthGuard` / `app/guards/`
- **Пример структуры**:
  ```
  app/
    ├── App.tsx
    ├── RootProvider.tsx
    ├── routes.tsx                 # Конфигурация роутов (config-based)
    ├── guards/
    │   └── AuthGuard.tsx          # Проверка авторизации
    └── pages/
        ├── home/
        │   └── page.tsx
        ├── profile/
        │   └── page.tsx
        └── login/
            └── page.tsx
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

- **Правила**:
  - Моки импортируются **только** из тестов и stories
  - Запрещён импорт моков в рабочий код (components, services, store)

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
| Base URL | env-переменная (`API_URL` и т.д.) | Не захардкожен в коде, читается из конфигурации окружения |
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
| Бизнес-модель | `lib/business/` или `store/*/types` | Модель после маппинга | `{ id: string; firstName: string; createdAt: Date }` |

**Правило**: компоненты и store **никогда** не работают с DTO напрямую. Между DTO и бизнес-моделью — конвертер. Конвертеры colocated — живут **рядом с местом использования** (в папке страницы, компонента или store-модуля):

```ts
// app/profilePage/utils/userConverter.ts
// или store/user/utils/userConverter.ts

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
- Конвертацию делает вызывающий код (store/hook/component), конвертер лежит рядом с ним
- Каждый endpoint — одна функция, один файл (или несколько мелких в одном файле, если они связаны)
- Никакой бизнес-логики в endpoint-функциях — только вызов клиента с параметрами

### Правила слоя services

- `services/` не импортирует из `components/`, `store/`, `app/`
- `services/` может импортировать из `lib/` (утилиты, типы)
- Endpoint-функции возвращают DTO, не бизнес-модели
- Токен-менеджмент живёт в `services/`, не в store
- Все env-переменные типизированы и читаются через `config/env.ts` (не напрямую из `process.env`)

### Валидация данных

- **Принцип**: по умолчанию доверяем контрактам с бэкендом. API отдаёт валидированные данные, клиент не дублирует валидацию.
- **Валидация ответов API**: только при явном требовании (нестабильный API, миграция, отсутствие контрактов). Схемы живут **рядом с endpoint-функцией**:
  ```
  services/
    └── api/
        └── auth/
            ├── login.ts
            └── login.schema.ts    # Zod-схема для валидации ответа login
  ```
- **Валидация форм**: доверяем бэкенду. Если клиентская валидация нужна (мгновенная обратная связь, UX), утилиты и Zod-схемы для полей форм живут в `lib/business/formatters/` (см. раздел `lib`). Это обобщённые валидации проекта: «дата больше текущей», «валидация денег», «формат числа» и т.д.
- **При отсутствии требования**: формы передают данные напрямую в endpoint-функцию, без промежуточной валидации.

## `store` - Глобальный стейт-менеджмент

- **Содержит**: всю конфигурацию state-менеджера — создание store, middleware, типы состояния.
- **Примечание**: имена файлов (`rootReducer.ts`, `*Slice.ts`) зависят от выбранного state-менеджера (Redux Toolkit, Zustand, MobX и т.д.). Пример ниже — одна из возможных структур.
- **Async-логика**:
  - Асинхронные операции (загрузка данных) живут **в store**, а не в компонентах
  - Файл рядом со слайсом: `userThunks.ts` / `userActions.ts` / `userEffects.ts` (зависит от state-менеджера)
  - Конвертация DTO → бизнес-модель происходит **в async-операции** (до попадания в store), конвертер лежит рядом (`store/user/utils/`)
  - Store хранит только бизнес-модели, никогда DTO
- **Пример структуры**:
  ```
  store/
    ├── store.ts              # Создание store + middleware + enhancers
    ├── rootReducer.ts        # Объединение всех слайсов/редьюсеров
    ├── middleware.ts          # Кастомные middleware (логирование и т.д.)
    ├── types.ts               # Типы глобального состояния и dispatch
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

## `config` - Конфигурация приложения

- **Назначение**: типизированный доступ к env-переменным и feature flags. Единственное место, где читаются `process.env` / `import.meta.env` и т.д.
- **Пример структуры**:
  ```
  config/
    ├── env.ts               # Типизированные env-переменные (API_URL, NODE_ENV и т.д.)
    └── features.ts          # Feature flags (включение/выключение фич)
  ```

- **Правила**:
  - Весь проект импортирует env через `config/env.ts`, а не напрямую из `process.env`
  - `env.ts` валидирует переменные при запуске (отсутствующие — ошибка, а не undefined)
  - Feature flags — булевы флаги, типизированы, с дефолтами

## `assets` - Статические ресурсы

- **Содержит**: изображения, шрифты, SVG-иконки, видео и другие файлы, которые не являются кодом.
- **Пример структуры**:
  ```
  assets/
    ├── images/
    │   ├── logo.svg
    │   └── hero-banner.webp
    ├── fonts/
    │   └── Inter-Regular.woff2
    └── icons/
        ├── arrow-right.svg
        └── close.svg
  ```

- **Правила**:
  - Именование: `kebab-case`
  - SVG-иконки, используемые как компоненты → `components/ui/atoms/icons/`
  - SVG-иконки, используемые как файлы (background, img src) → `assets/icons/`

## `lib` - Утилиты и вспомогательные функции

- **Структура**:
  - `hooks` - переиспользуемые хуки проекта (используются в нескольких местах)
  - `ts` - утилиты-дженерики для TypeScript
  - `business` - утилиты, зависящие от бизнес-логики
  - `utils` - чистые утилиты без контекста проекта

- **Разделение хуков**:
  - Хук используется **только в одном компоненте** → рядом с компонентом (`ProductCard.hooks.ts`)
  - Хук используется **в нескольких местах** → `lib/hooks/` (переиспользуемый)

- **Пример структуры `business/`**:
  ```
  business/
    └── formatters/
        ├── phoneMask.ts           # Маски и форматирование полей ввода
        ├── futureDate.ts          # Zod: дата должна быть больше текущей
        ├── moneyAmount.ts         # Zod: валидация денежных сумм
        └── numberFormat.ts        # Zod: обобщённая валидация чисел
  ```
  - Примечание: обобщённые утилиты и Zod-схемы для валидации полей форм. Схемы валидации **ответов API** живут рядом с endpoint-функциями (см. «Валидация данных»).

- **Пример структуры `utils/`**:
  ```
  utils/
    ├── string/                  # или string.ts — при малом количестве
    │   └── declOfNum.ts
    └── number/
        └── formatPrice.ts
  ```

- **Примеры**: подключение сторонних библиотек (карты, аналитика и т.д.) — обёртки в `lib/` для изоляции от проекта.

## File Naming Convention

| Тип файла | Формат | Пример |
|---|---|---|
| Папка компонента/утилиты | `camelCase/` | `productCard/`, `radioGroup/` |
| Компонент | `PascalCase.tsx` | `ProductCard.tsx` |
| Хук (привязан к компоненту) | `*.hooks.ts` | `ProductCard.hooks.ts` |
| Утилита | `camelCase.ts` | `formatPrice.ts` |
| Типы/интерфейсы (рядом с файлом) | `*.types.ts` | `ProductCard.types.ts` |
| Константы | `*.constants.ts` | `routes.constants.ts` |
| Стили компонента | `*.styles.ts` / `*.module.css` и т.д. | `productCard.styles.ts` |
| Тест | `*.test.tsx` / `*.test.ts` | `ProductCard.test.tsx` |
| Story | `*.stories.tsx` | `ProductCard.stories.tsx` |
| Мок | `*.mock.ts` | `userApi.mock.ts` |
| Barrel-экспорт | `index.ts` | В каждой папке |

**Правила**:
- Один компонент на файл
- Только именованный экспорт (`export default` запрещён)
- Barrel-экспорт (`index.ts`) в каждой папке
- Типы рядом с файлом: `ProductCard.types.ts` рядом с `ProductCard.tsx`
- Хуки рядом с компонентом: `ProductCard.hooks.ts` рядом с `ProductCard.tsx`
- Если типы общие для нескольких файлов — в общей папке `types/` модуля

**Barrel-экспорт (`index.ts`)** — что экспортирует:
- Только **публичный API** папки: компонент, типы пропсов
- **Не экспортирует**: внутренние хуки, утилиты, константы, тесты, stories
- Если папка содержит несколько компонентов — экспортирует все через именованный экспорт
- Пример:
  ```ts
  // components/ui/atoms/button/index.ts
  export { Button } from './Button';
  export type { ButtonProps } from './Button.types';
  ```

**Пример структуры компонента**:
```
productCard/
├── index.ts                  # barrel-экспорт
├── ProductCard.tsx           # компонент
├── ProductCard.hooks.ts      # хуки компонента
├── ProductCard.types.ts      # типы пропсов и внутренние типы
├── ProductCard.test.tsx      # тесты
├── ProductCard.stories.tsx   # storybook
└── productCard.module.css    # стили (формат зависит от проекта: CSS Modules, styled-components и т.д.)
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
  - Слой содержит: базовые стили (reset/normalize), тему (цвета, токены), утилитарные стили
- **Пример**:
  ```
  export const palette = {
    primary: '#0ea5e9',
  } as const;

  export type PaletteKey = keyof typeof palette;
  ```

#### `atoms/` - Примитивы

- **Правила**:
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
  - Допускается использование сторонних UI-библиотек (слайдеры, графики и т.д.)
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
                ├── NameProductColumnTable.tsx
                └── PriceProductColumnTable.tsx
  ```

#### Формальная граница: `patterns/` vs `features/`

Критерий проверяемый — **наличие импорта из `store/` или `services/`**:

| Критерий | `patterns/` | `features/` |
|---|---|---|
| Импорт из `store/` | **Запрещён** | **Обязателен** (хотя бы селектор или thunk) |
| Импорт из `services/` | **Запрещён** | **Допускается** (через хуки) |
| Источник данных | Только `props` | Store, context, services |
| Переиспользуемость | Высокая (не знает домен) | Средняя (привязана к бизнес-домену) |
| Storybook | Обязателен | Опционально |

**Правило решения**: если компонент не импортирует `store/` и `services/` — он `pattern` или `ui/organism`. Если импортирует — он `features/`.

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

Story-файл описывает компонент и его состояния. Конкретный API зависит от выбранного инструмента визуальной документации (Storybook, Ladle, Histoire и т.д.), но принцип единый.

**Каждый story-файл содержит:**

1. **Мета-описание** — название в sidebar, привязка к компоненту, тег автодокументации
2. **Описание controls** — маппинг пропсов на типы контролов (select, boolean, radio и т.д.)
3. **Набор stories** — каждый экспорт = одно состояние компонента

**Обязательные stories:**

| Story | Назначение |
|---|---|
| `Default` | Состояние по умолчанию, отображается при первом открытии |
| Все значения enum-пропсов | Визуальное покрытие всех вариантов (`variant`, `size` и т.д.) |

**Желательные stories:**

| Story | Назначение |
|---|---|
| Loading / Disabled | Состояния взаимодействия |
| Edge cases | Длинный текст, пустое содержимое, граничные значения |
| Адаптив | Проверка через viewport toolbar |

### Правила

- **Один story-файл на компонент**: `Button.stories.tsx` — не `Button.variants.stories.tsx` + `Button.states.stories.tsx`
- **Автодокументация**: включать тег автодокументации — генерирует документацию из типов
- **Controls**: описывать для всех пропсов с ограниченным набором значений
- **Naming экспорта**: `PascalCase`, на русском или английском — зависит от проекта, но единообразно. `Default` — обязательная story (отображается по умолчанию)
- **Изоляция**: story не должна зависеть от `store/`, `services/`, роутера. Если компоненту нужен провайдер — оборачивать через decorator/обёртку
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

Структура sidebar задаётся через мета-описание story. Иерархия соответствует структуре UI-кита:

### Что story демонстрирует для каждого компонента

| Обязательно | Желательно |
|---|---|
| Default (состояние по умолчанию) | Все варианты (`variant`, `size`) рядом |
| Все значения enum-пропсов | Loading/Disabled состояния |
| | Edge cases (длинный текст, пустое содержимое) |
| | Адаптив (через toolbar viewport) |
