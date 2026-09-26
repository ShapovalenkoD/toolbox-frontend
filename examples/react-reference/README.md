# React reference

Скелет нового проекта: образцы файлов, по которым видно, как раскладывать код и как он оформлен. Это не запускаемое приложение: здесь нет package.json, зависимостей, конфигурации сборщика и Storybook. Они создаются при инициализации проекта по [React-предпочтениям](../../docs/ReactPreferences.md) с проверкой актуальных версий. После переноса структуры образцы удаляются или заменяются кодом приложения.

[Общие соглашения](../../README.md) · [Структура](../../docs/ProjectStructure.md) · [Code Style Guide](../../docs/CODE_STYLE_GUIDE.md)

## Что внутри

```text
biome.json                       # форматирование, lint и сортировки — переносится в проект
config/                          # env и feature flags
src/
  main.tsx                       # точка входа, подключение глобальных стилей
  app/                           # App и RootProvider
  constants/                     # глобальные константы (размеры страниц)
  pages/
    connectionPage/              # форма: mutation, RHF + Zod, DTO-конвертеры
      -components/connectionForm/
      -utils/
    usersPage/                   # список на useQuery: поиск, loading/error/empty, Table + Pagination
      UsersPage.constants.tsx    # колонки таблицы
      -utils/
    ordersPage/                  # страница размещает готовую feature
  components/
    ui/
      foundation/                # токены, цвета, типографика, reset
      atoms/                     # CSS-классы примитивов + stories
      molecules/                 # TextField, LoadingButton + stories
      organisms/                 # Pagination (окно страниц), Table (TanStack Table) + stories
    business/
      layouts/pageLayout/        # области страницы без данных
      patterns/dataGrid/         # Table + Pagination, загрузка через loadData из props + story
      features/order/ordersGrid/ # подключает сервис и store, передаёт операцию в DataGrid
  services/
    api/httpClient/              # единственный HTTP-клиент и типизированная ошибка
    api/connection/              # mutation
    api/user/                    # query keys + useQuery
    api/order/                   # обычный async-метод для pattern
    localStorage/, cookies/      # типизированные get/set/delete со схемой значений
  store/                         # Zustand + immer, срез preferences
  lib/
    hooks/                       # useDebounce
    business/formatters/         # formatPhone — форматирование с контекстом проекта
    ts/                          # type-only утилиты
    utils/                       # чистые утилиты, папка на функцию
  mocks/
    service/                     # MSW-handlers по доменам
    components/                  # fixtures для stories
```

Пустых папок под будущие домены нет: они создаются, когда появляется потребность. Папки `routes/` нет: маршрутизация выбирается при инициализации проекта.

## Что смотреть

1. `pages/connectionPage/` — форма со схемой рядом (`ConnectionForm.schema.ts`) и DTO-конвертеры в `-utils/`.
2. `pages/usersPage/` — список на `useQuery`: страница владеет фильтром и номером страницы, запрос и его состояния — у TanStack Query.
3. `components/business/` — граница organism / pattern / feature:
   - `Table` и `Pagination` только отображают и сообщают о событиях;
   - `DataGrid` сам выполняет переданную `loadData`, отменяет устаревший запрос, держит страницу, размер и сортировку;
   - `OrdersGrid` подключает `getOrders` и store, преобразует DTO локально в `utils/`.
4. `services/api/` — `useQuery` с ключами домена (`user`) и обычный async-метод (`order`), который можно передать в pattern как операцию.
5. `store/` — срез на Zustand + immer; страница/feature читает и меняет его, store не знает о services.
6. `components/ui/` — foundation → atoms (только CSS) → molecules → organisms.
7. `lib/` — `utils` без контекста проекта, `business` с ним, общий хук в `hooks`.
8. Любой `index.ts` — публичный API через `export *` / `export type *`; именованный реэкспорт там, где файл содержит внутренние сущности (`pagination/index.ts`, `store/index.ts`).

## Стек, на который рассчитаны образцы

React, TypeScript, Vite, TanStack Query, TanStack Table v9, Axios, React Hook Form + Zod, Zustand + immer, CSS Modules + clsx, Storybook, MSW, Biome. Это один из допустимых вариантов, а не обязательный набор: при другом выборе (Next.js, Tailwind, fetch и т.п.) сохраняется раскладка и оформление, а инструментальные детали меняются по [React-предпочтениям](../../docs/ReactPreferences.md).

Алиасы, которые предполагают образцы: `@/*` → `src/*`, `@config` → `config/index.ts`. Их настраивают в tsconfig и сборщике при инициализации.

Последняя проверка образцов (26.09.2026, во временной копии с зависимостями): Biome, `tsc --noEmit`, сборка Vite и Storybook build; страницы users/orders проверены в браузере на моках.
