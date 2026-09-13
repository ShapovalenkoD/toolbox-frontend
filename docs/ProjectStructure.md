# Структура проекта - краткая версия

> Полная версия с примерами и контрактами: [ProjectStructure.full.md](ProjectStructure.full.md)

## Корень проекта (рядом с `package.json`)

- [`assets/`](ProjectStructure.full.md#assets---статические-ресурсы) - статические ресурсы (изображения, шрифты, SVG-иконки). Может называться `public/` (Next.js).
- [`config/`](ProjectStructure.full.md#config---конфигурация-приложения) - конфигурация приложения (env-переменные, feature flags, `.env` файлы).
- [`docs/`](ProjectStructure.full.md#docs---документация-проекта) - документация проекта.
- `src/` - **весь исходный код** приложения. Всё ниже — внутри `src/`.

## Внутри `src/`

- [`app/`](ProjectStructure.full.md#app---точка-входа-приложения) - точка входа в приложение: провайдеры, роутинг, страницы. **Не содержит** конфигурацию store.
- [`components/`](ProjectStructure.full.md#components---компоненты-приложения) - общая папка для всех компонентов.
  - `business/` - компоненты, относящиеся к бизнес-логике
    - `layouts/` - композиции макетов, без логики
    - `patterns/` - шаблонные компоненты с обобщённой бизнес-логикой
    - `features/` - компоненты с конечной реализацией бизнес-логики
  - `ui/` - общая папка для UI-кита
    - `foundation/` - глобальные стилевые константы с их типами
    - `atoms/` - примитивы: стили, токены, CSS-классы, stories
    - `molecules/` - группы атомов
    - `organisms/` - комплексные UI-компоненты
- [`constants/`](ProjectStructure.full.md#constants---глобальные-константы-приложения) - глобальные константы проекта (regex, роуты, общие значения).
- [`lib/`](ProjectStructure.full.md#lib---утилиты-и-вспомогательные-функции) - общие утилиты и библиотеки.
  - `hooks/` - хуки проекта
  - `ts/` - утилиты-дженерики для TypeScript
  - `business/` - утилиты, зависящие от бизнес-логики проекта
  - `utils/` - чистые утилиты без контекста проекта
- [`mocks/`](ProjectStructure.full.md#mocks---моковые-данные-для-тестов-и-разработки) - моковые данные для тестов и разработки.
  - `service/` - моки API-сервисов
  - `components/` - моки для пропсов компонентов
- [`services/`](ProjectStructure.full.md#services---работа-с-side-эффектами) - сервисы для работы с side-effects (API, localStorage, cookie).
  - `api/` - HTTP-клиент, interceptors, endpoint-функции по доменам
  - `localStorage/` - методы для работы с localStorage
  - `cookies/` - методы для работы с cookies
  - `types/` - общие типы для работы с services
- [`store/`](ProjectStructure.full.md#store---клиентское-состояние) - клиентское состояние (UI, сессия, preferences). **Не хранит данные из API** — они используются по месту вызова из `services/api/`.

---

# Правила организации файлов

## Правило: каждый домен = отдельная папка

Категорически запрещено складывать файлы разных доменов в одну папку. Каждая бизнес-сущность (auth, user, product, order и т.д.) получает **свою подпапку**.

**Неправильно** — всё в одной папке:

```
services/api/
  ├── login.ts
  ├── logout.ts
  ├── getUser.ts
  ├── getProduct.ts
  └── createOrder.ts
```

**Правильно** — каждый домен в отдельной папке:

```
services/api/
  ├── auth/
  │   ├── login.ts
  │   └── logout.ts
  ├── user/
  │   └── getUser.ts
  ├── product/
  │   └── getProduct.ts
  └── order/
      └── createOrder.ts
```

Это правило применяется **везде**: `services/api/`, `store/`, `components/business/features/`, `mocks/service/`.

## File Naming Convention

**Общее правило**: `PascalCase` для React-компонентов (`.tsx`) и всех файлов-компаньонов компонента. `camelCase` для всего остального.

| Тип файла                           | Формат                                         | Пример                        |
| ----------------------------------- | ---------------------------------------------- | ----------------------------- |
| Папка компонента/утилиты            | `camelCase/`                                   | `productCard/`, `radioGroup/` |
| Компонент                           | `PascalCase.tsx`                               | `ProductCard.tsx`             |
| Хук (привязан к компоненту)         | `PascalCase.hooks.ts`                          | `ProductCard.hooks.ts`        |
| Интерфейсы (привязаны к компоненту) | `PascalCase.interface.ts`                      | `ProductCard.interface.ts`    |
| Тест (привязан к компоненту)        | `PascalCase.test.tsx`                          | `ProductCard.test.tsx`        |
| Story (привязан к компоненту)       | `PascalCase.stories.tsx`                       | `ProductCard.stories.tsx`     |
| Стили компонента                    | `camelCase.module.css` / `camelCase.styles.ts` | `productCard.module.css`      |
| Утилита                             | `camelCase.ts`                                 | `formatPrice.ts`              |
| Константы                           | `camelCase.constants.ts`                       | `routes.constants.ts`         |
| Мок                                 | `camelCase.mock.ts`                            | `userApi.mock.ts`             |
| Barrel-экспорт                      | `index.ts`                                     | В каждой папке                |

**Правила**:

- Один компонент на файл
- Только именованный экспорт (`export default` запрещён)
- Barrel-экспорт (`index.ts`) в каждой папке
- Файлы-компаньоны компонента (`.hooks.ts`, `.interface.ts`, `.test.ts`, `.stories.tsx`) наследуют PascalCase от компонента
- Стили — всегда camelCase: `productCard.module.css`, `productCard.styles.ts`
- Интерфейсы рядом с файлом: `ProductCard.interface.ts` рядом с `ProductCard.tsx`
- Хуки рядом с компонентом: `ProductCard.hooks.ts` рядом с `ProductCard.tsx`
- Если интерфейсы общие для нескольких файлов — в общей папке `types/` модуля

**Barrel-экспорт (`index.ts`)** — что экспортирует:

- Только **публичный API** папки: компонент, интерфейсы пропсов
- **Не экспортирует**: внутренние хуки, утилиты, константы, тесты, stories
- Если папка содержит несколько компонентов — экспортирует все через именованный экспорт
- Пример:
  ```ts
  export { ProductCard } from "./ProductCard";
  export type { ProductCardProps } from "./ProductCard.interface";
  ```

**Пример структуры компонента**:

```
productCard/
├── index.ts                     # barrel-экспорт
├── ProductCard.tsx              # компонент
├── ProductCard.hooks.ts         # хуки компонента
├── ProductCard.interface.ts     # интерфейсы пропсов и внутренние типы
├── ProductCard.test.tsx         # тесты
├── ProductCard.stories.tsx      # storybook
└── productCard.module.css       # стили (формат зависит от проекта: CSS Modules, styled-components и т.д.)
```

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

| Кто импортирует  | Кого нельзя                                          | Причина                                                         |
| ---------------- | ---------------------------------------------------- | --------------------------------------------------------------- |
| `lib/`           | `services/`, `store/`, `components/`                 | Утилиты должны быть чистыми, без side-effects                   |
| `components/ui/` | `services/`, `store/`, `components/business/`        | UI-кит не знает о бизнесе                                       |
| `services/`      | `components/`, `store/`                              | Сервисы не зависят от UI или состояния                          |
| `store/`         | `components/`, `services/`                           | Стор не знает, кто его использует                               |
| `constants/`     | `services/`, `store/`, `components/`, `lib/`         | Константы — листовые узлы                                       |
| `mocks/`         | `services/`, `store/`, `components/`, `lib/`, `app/` | Моки только для тестов и stories, запрещён импорт в рабочий код |

**Реализация:** правило линтера `import/no-restricted-paths` (или аналог) для автоматической проверки границ зависимостей.
