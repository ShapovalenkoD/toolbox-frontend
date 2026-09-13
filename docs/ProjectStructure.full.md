# Структура проекта - полная версия

> Краткая версия: [ProjectStructure.md](ProjectStructure.md)

## `docs` - Документация проекта

Находится в корне проекта (рядом с `package.json`), **не** внутри `src/`.

- **Содержит**: `ProjectStructure.md`, `ProjectStructure.full.md`, `CODE_STYLE_GUIDE.md` и другую документацию.

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
                ├── CardProfile.interface.ts
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

## `assets` - Статические ресурсы

Находится в корне проекта (рядом с `package.json`), **не** внутри `src/`.

- **Примечание**: папка может называться `assets/` или `public/` (Next.js). Выбрать одно на старте проекта.
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

#### `atoms/` - Примитивы (стили и токены)

- **Правила**:
  - Атомы — это **стили, CSS-классы и токены**, а не React-компоненты
  - Утилитарные классы, помогающие основному классу (размер, вариант)
  - Каждый атом обязан иметь **story** в Storybook
- **Пример структуры**:
  ```
  atoms/
    ├── button/
    │   ├── index.ts
    │   ├── button.module.css         # Стили кнопки
    │   ├── button.styles.ts          # Программные стили (если needed)
    │   └── Button.stories.tsx        # Storybook story
    ├── input/
    │   ├── index.ts
    │   ├── input.module.css
    │   └── Input.stories.tsx
    └── icons/
        ├── index.ts
        ├── icons.module.css
        └── Icons.stories.tsx
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
    │   ├── RadioGroup.interface.ts
    │   └── radioGroup.module.css
    ├── loadingButton/
    │   ├── index.ts
    │   ├── LoadingButton.tsx
    │   ├── LoadingButton.interface.ts
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
        ├── Carousel.interface.ts
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
        ├── Card.interface.ts
        └── card.module.css
  ```

#### `features/` - Компоненты с конечной бизнес-логикой

- **Правила**:
  - Обязательно имеют конечную реализацию бизнес-логики
  - Минимальное количество конфигураций (только визуальные: `getName`, `className`)
  - Переиспользуются в pages
  - **Каждый бизнес-домен = отдельная подпапка** (cards/, table/, profile/ и т.д.)
  - Интеграция с внешними провайдерами данных (context/store) допускается

- **Пример структуры**:
  ```
  features/
    ├── cards/
    │   └── productCard/
    │       ├── index.ts
    │       ├── ProductCard.tsx
    │       ├── ProductCard.hooks.ts
    │       └── ProductCard.interface.ts
    └── table/
        └── columns/
            └── product/
                ├── index.ts
                ├── NameProductColumnTable.tsx
                └── PriceProductColumnTable.tsx
  ```

#### Формальная граница: `patterns/` vs `features/`

Критерий проверяемый — **наличие импорта из `store/` или `services/`**:

| Критерий              | `patterns/`              | `features/`                                 |
| --------------------- | ------------------------ | ------------------------------------------- |
| Импорт из `store/`    | **Запрещён**             | **Обязателен** (хотя бы селектор или thunk) |
| Импорт из `services/` | **Запрещён**             | **Допускается** (через хуки)                |
| Источник данных       | Только `props`           | Store, context, services                    |
| Переиспользуемость    | Высокая (не знает домен) | Средняя (привязана к бизнес-домену)         |
| Storybook             | Обязателен               | Опционально                                 |

**Правило решения**: если компонент не импортирует `store/` и `services/` — он `pattern` или `ui/organism`. Если импортирует — он `features/`.

## `config` - Конфигурация приложения

Находится в корне проекта (рядом с `package.json`), **не** внутри `src/`.

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

## `constants` - Глобальные константы приложения

- **Содержит**: только константы-примитивы и конфигурационные объекты без side-effects.
- **Не содержит**: API-константы (notification messages) — они относятся к `services/`.
- **Примеры файлов**:
  ```
  constants/
    ├── regex.ts
    └── routes.ts
  ```

## `lib` - Утилиты и вспомогательные функции

- **Структура**:
  - `hooks/` - переиспользуемые хуки проекта (используются в нескольких местах)
  - `ts/` - утилиты-дженерики для TypeScript
  - `business/` - утилиты, зависящие от бизнес-логики
  - `utils/` - чистые утилиты без контекста проекта

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

## `mocks` - Моковые данные для тестов и разработки

- **Структура**: моки организованы по доменам (как `services/api/`):
  - `service/` - моки API-сервисов, **каждый домен в отдельной папке**
  - `components/` - моки для пропсов компонентов
- **Пример структуры**:

  ```
  mocks/
    ├── service/
    │   ├── auth/
    │   │   └── login.mock.ts
    │   └── user/
    │       └── getUser.mock.ts
    └── components/
        └── CardProfile.mock.ts
  ```

- **Правила**:
  - Моки импортируются **только** из тестов и stories
  - Запрещён импорт моков в рабочий код (components, services, store)
  - **Каждый домен = отдельная папка** (не класть все моки в одну папку)

## `services` - Работа с side-эффектами

- **Назначение**: единственный слой, взаимодействующий с внешним миром (HTTP, storage, cookies). Инкапсулирует все side-effects.
- **Правило**: `services/` не знает о UI, store, компонентах. Возвращает данные — кто вызывает решает, куда их положить.
- **Важно**: **каждый домен = отдельная папка** в `api/`. Не класть все endpoint-функции в одну папку.

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
      ├── request.interface.ts       # Интерфейсы запросов (DTO)
      ├── response.interface.ts      # Интерфейсы ответов (DTO)
      └── error.interface.ts         # Интерфейсы ошибок API
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
      ├── request.interface.ts
      ├── response.interface.ts
      └── error.interface.ts
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

| Параметр               | Откуда берётся                                | Описание                                                     |
| ---------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| Base URL               | env-переменная (`API_URL` и т.д.)             | Не захардкожен в коде, читается из конфигурации окружения    |
| Timeout                | константа в `client.ts` (по умолчанию 30 сек) | Меняется per-request при необходимости                       |
| Заголовки по умолчанию | `client.ts`                                   | `Content-Type: application/json`, `Accept: application/json` |

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
// services/types/error.interface.ts — пример

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

| Уровень        | Где живёт                              | Что это               | Пример                                                   |
| -------------- | -------------------------------------- | --------------------- | -------------------------------------------------------- |
| DTO (request)  | `services/types/request.interface.ts`  | Тело запроса к API    | `{ email: string; password: string }`                    |
| DTO (response) | `services/types/response.interface.ts` | Тело ответа от API    | `{ id: number; first_name: string; created_at: string }` |
| Бизнес-модель  | `lib/business/` или `store/*/types/`   | Модель после маппинга | `{ id: string; firstName: string; createdAt: Date }`     |

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
- **Каждый домен = отдельная папка**: `services/api/auth/`, `services/api/user/`, `services/api/product/`

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

## `store` - Клиентское состояние

**Только клиентское состояние.** Store не хранит данные из API — они используются по месту вызова из `services/api/` (см. «Server state»).

- **Что хранит store**: UI state (модалки, сайдбар, тема), auth session (токен, isLoggedIn), preferences (язык, настройки), form drafts (черновики форм), client-only данные (корзина до отправки, локальные вычисления).
- **Что НЕ хранит store**: данные из API (списки, профили, заказы), кеш запросов, loading/error состояния API-вызовов.
- **Примечание**: имена файлов зависят от выбранного state-менеджера (Zustand, Redux Toolkit, MobX и т.д.).
- **Каждый домен = отдельная папка**: `auth/`, `ui/`, `cart/` и т.д.
- **Пример структуры**:
  ```
  store/
    ├── store.ts              # Создание store + middleware
    ├── types.ts               # Типы глобального состояния
    ├── auth/
    │   ├── authStore.ts       # Токен, isLoggedIn, session
    │   └── authSelectors.ts
    ├── ui/
    │   ├── uiStore.ts         # Модалки, сайдбар, тема
    │   └── uiSelectors.ts
    └── cart/
        ├── cartStore.ts       # Корзина (client-only до отправки)
        └── cartSelectors.ts
  ```

### Server state — данные из API

Данные из API **не хранятся в store**. Они живут в `services/api/` и используются **по месту вызова** — на странице, в feature-компоненте, в хуке.

- **Как работает**: импортируешь endpoint-функцию из `services/api/` напрямую, передаёшь параметры, используешь `fromDto` по месту если нужно.
- **React Query / SWR — опционально**: если используется, оборачивает вызов API **по месту**, а не в общем слое хуков. Нет shared `lib/hooks/queries/`.
- **Пример без React Query**:
  ```ts
  // app/userPage/page.tsx
  import { getUser } from '@/services/api/user/getUser';
  import { userFromDto } from './utils/userFromDto';

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser(id).then((dto) => setUser(userFromDto(dto)));
  }, [id]);
  ```
- **Пример с React Query (по месту)**:
  ```ts
  // app/userPage/page.tsx
  import { useQuery } from '@tanstack/react-query';
  import { getUser } from '@/services/api/user/getUser';
  import { userFromDto } from './utils/userFromDto';

  const { data } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    select: (dto) => userFromDto(dto),
  });
  ```

**Граница store vs server state:**

| Критерий | `store/` | Данные из API |
|---|---|---|
| Источник | Клиент | `services/api/` |
| Примеры | UI state, session, preferences | Списки, профили, заказы |
| Конвертация `fromDto` | Не нужна | По месту вызова |
| Хранение | Глобальный store | Локальное состояние страницы/компонента (или кеш React Query) |
| Loading/error | Нет (данные всегда доступны) | Да (useState / React Query) |

---

## Storybook

- **Назначение**: визуальная документация UI-кита. Storybook — единственный источник правды о том, как выглядит и ведёт себя каждый UI-компонент.
- **Расположение**: stories живут **рядом с компонентом** (не в отдельной папке):
  ```
  button/
    ├── index.ts
    ├── button.module.css
    └── Button.stories.tsx     # ← здесь
  ```

### Какие компоненты **обязаны** иметь story

| Слой                 | Story обязателен | Причина                                                               |
| -------------------- | ---------------- | --------------------------------------------------------------------- |
| `ui/atoms/`          | Да               | Базовые строительные блоки, должны быть задокументированы             |
| `ui/molecules/`      | Да               | Переиспользуемые композиции, разработчики должны видеть все состояния |
| `ui/organisms/`      | Да               | Сложные блоки, требуют интерактивной демонстрации                     |
| `business/layouts/`  | Опционально      | Макеты без логики, story полезна для визуальной проверки              |
| `business/patterns/` | Опционально      | Шаблонные компоненты с большим количеством конфигураций               |
| `business/features/` | Нет              | Содержат бизнес-логику и привязку к store — сложно изолировать        |

### Структура story-файла

Story-файл описывает компонент и его состояния. Конкретный API зависит от выбранного инструмента визуальной документации (Storybook, Ladle, Histoire и т.д.), но принцип единый.

**Каждый story-файл содержит:**

1. **Мета-описание** — название в sidebar, привязка к компоненту, тег автодокументации
2. **Описание controls** — маппинг пропсов на типы контролов (select, boolean, radio и т.д.)
3. **Набор stories** — каждый экспорт = одно состояние компонента

**Обязательные stories:**

| Story                     | Назначение                                                    |
| ------------------------- | ------------------------------------------------------------- |
| `Default`                 | Состояние по умолчанию, отображается при первом открытии      |
| Все значения enum-пропсов | Визуальное покрытие всех вариантов (`variant`, `size` и т.д.) |

**Желательные stories:**

| Story              | Назначение                                           |
| ------------------ | ---------------------------------------------------- |
| Loading / Disabled | Состояния взаимодействия                             |
| Edge cases         | Длинный текст, пустое содержимое, граничные значения |
| Адаптив            | Проверка через viewport toolbar                      |

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

| Обязательно                      | Желательно                                    |
| -------------------------------- | --------------------------------------------- |
| Default (состояние по умолчанию) | Все варианты (`variant`, `size`) рядом        |
| Все значения enum-пропсов        | Loading/Disabled состояния                    |
|                                  | Edge cases (длинный текст, пустое содержимое) |
|                                  | Адаптив (через toolbar viewport)              |
