# Code Style Guide

> Именование файлов, barrel-экспорт, запрет `export default` — см. [ProjectStructure.md](ProjectStructure.md#file-naming-convention).

---

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

Интерфейсы выносим в отдельный файл `*.interface.ts`. Для маленьких модулей допустим один файл `interface.ts`. См. также [File Naming Convention](ProjectStructure.md#file-naming-convention).

### Type assertions

Используйте аннотации типов (`: Foo`) вместо type assertions (`as Foo`). Аннотация позволяет линтеру находить ошибки при рефакторинге.

```ts
// Правильно
const foo: Foo = { bar: 123 };

// Неправильно — "bam" не будет поймано при изменении Foo
const foo = { bar: 123, bam: "abc" } as Foo;
```

### Spread оператор

Тип spread-значения должен соответствовать создаваемому. Объект spread-ит объекты, массив — итерируемые. Примитивы, `null`, `undefined` не spread-ятся.

```ts
// Правильно
const bar = { num: 5, ...(shouldUseFoo && foo) };

// Неправильно — может быть undefined
const bar = { num: 5, ...(condition && obj) };
```

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

- Только именованный экспорт (`export default` запрещён).
- Не экспортируем мутабельные объекты (`export let` запрещён).

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
- Интерфейсы props выносим в companion-файл `PascalCase.interface.ts` рядом с компонентом.

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
