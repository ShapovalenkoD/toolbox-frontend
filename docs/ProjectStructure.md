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
    - `patterns/` - настраиваемые сценарии, получающие данные, правила и операции через props: DataGrid объединяет Table и Pagination и управляет загрузкой
    - `features/` - конкретные бизнес-сценарии; могут подключать services и store
  - `ui/` - общая папка для UI-кита
    - `foundation/` - глобальные стилевые константы с их типами
    - `atoms/` - стили и классы HTML-примитивов, локальные стилевые токены, stories; без production React-компонентов
    - `molecules/` - небольшие UI-композиции: TextField, LoadingButton
    - `organisms/` - сложный UI: Table, Pagination с вычислением окна страниц и переходов; не управляют внешними операциями
- [`constants/`](ProjectStructure.full.md#constants---глобальные-константы-приложения) - глобальные константы проекта (regex, роуты, общие значения).
- [`lib/`](ProjectStructure.full.md#lib---утилиты-и-вспомогательные-функции) - общие утилиты и библиотеки.
  - `hooks/` - хуки проекта
  - `ts/` - утилиты-дженерики для TypeScript
  - `business/` - утилиты, зависящие от бизнес-логики проекта
  - `utils/` - чистые утилиты без контекста проекта
- [`mocks/`](ProjectStructure.full.md#mocks---моковые-данные-для-тестов-и-разработки) - моковые данные для тестов и разработки.
  - `service/` - моки API-сервисов
  - `components/` - моки для пропсов компонентов
- [`services/`](ProjectStructure.full.md#services---работа-с-side-эффектами) - внешние взаимодействия: API, localStorage, sessionStorage, cookies, обмен между вкладками. Принимают/возвращают DTO; могут проверять их схему.
  - `api/` - HTTP-клиент, endpoint-функции, при необходимости React Query/SWR-интеграция по доменам; без преобразований под UI
  - `localStorage/` - методы для работы с localStorage
  - `sessionStorage/` - методы для работы с sessionStorage
  - `cookies/` - методы для работы с cookies
  - `channels/` - обмен сообщениями между вкладками, если требуется
  - `types/` - общие типы для работы с services
- [`store/`](ProjectStructure.full.md#store---клиентское-состояние) - внутреннее состояние приложения. Может принимать модели, собранные страницей/feature из внешних данных; не знает о DTO и не импортирует services.

## Локальность и поток данных

Страница — модуль: её внутренние компоненты находятся в `_components/`, хуки, типы и утилиты — рядом. Они остаются локальными, пока принадлежат этой странице.

`services → DTO → страница/бизнес-компонент → локальное представление → UI и/или store` — это поток данных, не схема импортов. При отправке локальное представление преобразуется в request DTO и передаётся сервису.

Конвертеры `{entity}FromDto.ts` / `{entity}ToDto.ts` принадлежат потребителю. Совпадение преобразований разных страниц допустимо. Общим становится целый бизнес-сценарий вместе с его преобразованиями, а не отдельный глобальный конвертер. Основной контракт: [DTO vs внутренние модели](ProjectStructure.full.md#dto-vs-внутренние-модели).

Критерии выбора UI и бизнес-компонента: [organisms, patterns, features](ProjectStructure.full.md#граница-organisms-patterns-и-features).

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

- Только **публичный API** папки: например, компонент и props; для CSS-атома — классы/стили, без пустого компонента-обёртки
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

`A → B` означает «A может импортировать B». Ниже перечислены разрешения между архитектурными зонами; обратное направление из них не следует.

| Кто | Допустимые зависимости |
|---|---|
| app / страницы | components, services, store, lib, constants, config |
| business/features | UI, patterns, layouts, services, store, lib, constants, config |
| business/patterns | UI, layouts, lib, constants; DTO-типы services только для собственного входного контракта/конвертеров |
| business/layouts | UI, lib/utils, constants |
| UI | Собственные UI-модули, lib/utils, общие UI-хуки lib/hooks; без бизнес-контекста |
| services | Другие сервисные модули, lib, constants, config |
| store | Собственные модули store, lib, constants; без services и DTO |
| lib | Другие lib-модули, constants; без services, store, components и app |
| constants | Без зависимостей от остальных зон |
| config | Без зависимостей от app, components, services и store |

Внешние библиотеки допустимы в соответствии с ответственностью слоя. Внутренние зависимости не должны образовывать циклы. UI-композиция направлена от organisms к molecules/atoms/foundation и от molecules к atoms/foundation; нижние уровни не импортируют верхние.

**Обязательные ограничения:**
- Services и store не импортируют друг друга, включая `import type`.
- Patterns не импортируют исполняемые services/store, в том числе через промежуточные хуки. Переданные операции через props разрешены.
- UI не импортирует бизнес-модули, services, store или DTO-типы и не получает операции доступа к данным как зависимости.
- Страница не импортирует локальные конвертеры другой страницы; общий сценарий выделяется целиком в business.
- Рабочий код не импортирует mocks. Тестовые файлы проверяются по отдельным правилам.
- Ограничения распространяются на относительные пути, алиасы и реэкспорты. Исключение для DTO-типов patterns не разрешает runtime-импорт.

Контракты ответственности и примеры: [полная версия](ProjectStructure.full.md). Правила imports должны быть отражены в конфигурации линтера проекта; одного наличия таблицы недостаточно.
