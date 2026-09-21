# Code Style Guide

> Основной документ для именования и соглашений о коде. Размещение и [публичный API](ProjectStructure.md#дерево-публичных-экспортов) определены в краткой структуре. [Роли документов](../README.md#документация).

---

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
| Barrel-экспорт                      | `index.ts`                                     | В папках с публичными экспортами |

**Правила**:

- Один компонент на файл
- Именованный экспорт в прикладном коде; обязательные default exports фреймворков и инструментов допускаются — см. [правила экспорта](#экспорт).
- Файлы-компаньоны компонента (`.hooks.ts`, `.interface.ts`, `.test.ts`, `.stories.tsx`) наследуют PascalCase от компонента
- Стили — всегда camelCase: `productCard.module.css`, `productCard.styles.ts`
- Собственные интерфейсы — в отдельном файле рядом с реализацией: `ProductCard.interface.ts` рядом с `ProductCard.tsx`. Если интерфейсов нет, пустой файл не создаём.
- Хуки рядом с компонентом: `ProductCard.hooks.ts` рядом с `ProductCard.tsx`
- Если интерфейсы общие для нескольких файлов — в общей папке `types/` модуля

## TypeScript

### Именование идентификаторов

| Сущность | Формат | Пример |
|---|---|---|
| Класс | UpperCamelCase | `UserService` |
| Интерфейс | UpperCamelCase (без `I`-префикса) | `Reader`, не `IReader` |
| Тип | UpperCamelCase (без `T`-префикса) | `Reader`, не `TReader` |
| Enum | UpperCamelCase | `HttpStatus` |
| Значения enum | CONSTANT_CASE | `OK`, `NOT_FOUND` |
| Переменная / параметр / функция / метод | lowerCamelCase | `userName`, `getUser()` |
| Константа-примитив | CONSTANT_CASE | `MAX_RETRIES` |
| Константа-объект/массив | UpperCamelCase | `DefaultConfig` |
| Static readonly поле | CONSTANT_CASE | `DEFAULT_TIMEOUT` |

### Аббревиатуры

Рассматриваем как слово в camelCase. `loadHttpRequest` — правильно, `loadHTTPRequest` — неправильно.

### Интерфейсы

Собственные интерфейсы выносим в отдельный файл `*.interface.ts`, даже для небольшого компонента или утилиты. Если собственных интерфейсов нет, пустой файл не создаём. Для маленьких модулей допустим один файл `interface.ts`. Наличие интерфейса в отдельном файле не означает его обязательный экспорт через публичный индекс. См. также [File Naming Convention](#file-naming-convention).

### Type assertions

Используйте аннотации типов (`: Foo`) вместо type assertions (`as Foo`). Аннотация позволяет линтеру находить ошибки при рефакторинге.

```ts
// Правильно
const foo: Foo = { bar: 123 };

// Неправильно — "bam" не будет поймано при изменении Foo
const foo = { bar: 123, bam: "abc" } as Foo;
```

### Spread оператор

**Объектный spread** копирует собственные перечисляемые свойства. В JavaScript `null` и `undefined` пропускаются; boolean и number не добавляют свойств, а строка может добавить свойства с индексами символов. Это не означает, что любые примитивы следует использовать как объект в TypeScript: выражение также должно проходить проверку типов.

Для условного добавления свойств используем явную объектную ветку; `...(condition && object)` тоже допустим, если типы выражения это позволяют.

```ts
const includeLabel = true;
const extra = { label: "Название" };
const result = { id: 1, ...(includeLabel ? extra : {}) };

// Необязательный объект: отсутствие значения явно заменяется пустым объектом.
const withLabel = (value: { label: string } | undefined) => ({
  id: 1,
  ...(value ?? {}),
});
```

**Spread в массиве** требует итерируемое значение. Для условного добавления элементов используем пустой массив в альтернативной ветке.

```ts
const includeExtra = false;
const extraItems = [2, 3];
const items = [1, ...(includeExtra ? extraItems : [])];

// Неправильно: при false получаем неитерируемое значение.
// const items = [1, ...(includeExtra && extraItems)];
```

Оба вида spread создают поверхностную копию: вложенные объекты не клонируются рекурсивно. Семантика object spread: [ECMAScript CopyDataProperties](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-copydataproperties).

### Поля классов

- **`#private` поля** — не используем. Применяем `private` модификатор.
- **Parameter properties** — используем для инициализации полей через конструктор: `constructor(private readonly bar: number) {}`
- **Инициализаторы** — если поле не параметр конструктора, инициализируем в месте объявления.
- **Геттеры/сеттеры** — должны содержать логику, отличную от простого get/set приватного значения.

### Примитивные типы

Не используем классы-обёртки (`String`, `Boolean`, `Number`). `new Boolean(false)` считается `true`.

### Array конструктор

Не используем `new Array()`. Применяем `[]` или `Array.from()`:

```ts
const a = [2, 3];
const c = Array.from<number>({ length: 5 }).fill(0);
```

### Преобразования типов

Для парсинга чисел — `Number()` с проверкой на `NaN`. Не используем унарный плюс (`+y`) — его легко пропустить на ревью. `parseInt` допустим только для недесятичных систем с проверкой входных данных.

```ts
let f = Number(someString);
if (isNaN(f)) handleError();
```

### Экспорт

- В собственном прикладном коде используем именованный экспорт.
- `export default` разрешён, если его требует контракт выбранного фреймворка или инструмента: например, страницы и layouts Next.js App Router, метаданные Storybook CSF 3, соответствующие конфигурационные файлы. Исключение относится к конкретному файлу, не ко всей папке. Учитываем формат и версию инструмента.
- Правила линтера должны учитывать эти исключения. Не заменяем обязательный default export именованным ради общего соглашения. См. [Next.js layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout) и [Storybook CSF 3](https://storybook.js.org/docs/9/api/csf).
- `export let` запрещён: изменяемая экспортируемая привязка затрудняет отслеживание состояния.
- `export const` запрещает переназначение привязки, но **не запрещает изменение свойств объекта или элементов массива**.
- Публичные объекты-константы предоставляем через readonly-типы; для литералов подходит `as const`. Это ограничение TypeScript, а не runtime-заморозка. Если нужна runtime-защита, `Object.freeze` замораживает только сам объект, без рекурсивной заморозки вложенных объектов.
- Изменяемое состояние принадлежит модулю-владельцу и изменяется через его явные операции, а не произвольной записью потребителя в экспортированный объект.

```ts
export const DefaultConfig = {
  pageSize: 20,
} as const;

// Ошибка TypeScript:
// DefaultConfig.pageSize = 50;
```

Подробнее о compile-time ограничениях: [TypeScript readonly properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties).

---

## Правила, покрываемые линтером

Ниже — правила, которые ESLint/Prettier проверяют автоматически. Ссылки ведут на документацию правил.

| Правило | ESLint правило |
|---|---|
| Блоковые скобки `{}` в if/for/while | [`curly`](https://eslint.org/docs/rules/curly) |
| Строгое сравнение `===` / `!==` | [`eqeqeq`](https://eslint.org/docs/rules/eqeqeq) |
| `const`/`let` вместо `var` | [`no-var`](https://eslint.org/docs/rules/no-var) |
| Порядок импортов (библиотеки → абсолютные → относительные) | [`import/order`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md) |
| Проверка `hasOwnProperty` в `for...in` | [`guard-for-in`](https://eslint.org/docs/rules/guard-for-in) |
| `_` префикс для неиспользуемых переменных | [`@typescript-eslint/no-unused-vars`](https://typescript-eslint.io/rules/no-unused-vars/) |
| Длинные строки, переносы | Prettier `printWidth` |

---

## React

Архитектурная классификация определена в [полной структуре](ProjectStructure.full.md#граница-organisms-patterns-и-features). Правила компонентов ниже относятся к существующим React-компонентам: CSS-атом не требует создания компонента или props-интерфейса.

- `props` принимаем как аргумент, деструктуризируем **на следующей строке** в теле функции:
  ```tsx
  // Правильно
  const Button = (props: ButtonProps) => {
    const { variant, children, onClick } = props;

  // Неправильно
  const Button = ({ variant, children, onClick }: ButtonProps) => {
  ```
- Один файл = одна компонента.
- Собственные интерфейсы props выносим в companion-файл `PascalCase.interface.ts` рядом с компонентом. При отсутствии собственных интерфейсов файл не создаём.

### Обработчики событий

У UI-компонента callback сообщает о взаимодействии. У business pattern callback может представлять операцию, результат которой pattern ожидает и обрабатывает. Названия отражают смысл: `onSortChange` для события, `saveChanges` для операции. Само наличие callback не делает UI-компонент бизнес-компонентом.

Именованные функции в теле компонента, **не** стрелочные в JSX:

```tsx
// Правильно
const handleClick = () => { /* ... */ };
return <button onClick={handleClick}>;

// Неправильно
return <button onClick={() => { /* ... */ }}>
```

Исключение: тривиальные делегаты с параметром допустимы:
```tsx
return <button onClick={() => onRemove(id)}>Удалить</button>
```
