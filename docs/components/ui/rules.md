# components/ui/ — Правила

## Что это
UI-кит. Переиспользуемые компоненты без бизнес-логики.

## Структура
```
ui/
  ├── foundation/        # Токены: цвета, типографика, отступы, тема
  ├── atoms/             # Примитивы: Button, Input, Icon, Badge
  ├── molecules/         # Группы атомов: RadioGroup, SearchField, Alert
  └── organisms/         # Сложные блоки: Carousel, DataTable, Modal
```

## Правила
- **Не импортирует** из `services/`, `store/`, `components/business/`.
- Только внешние библиотеки и другие `ui/`-компоненты.
- Каждый компонент обязан иметь **story** (atoms, molecules, organisms).
- Только **именованный экспорт** (`export default` запрещён).
- Barrel-экспорт в каждой папке: только публичный API.

## Нельзя
- Импортировать `store/`, `services/`, `components/business/`.
- Класть бизнес-логику в UI-компоненты.
- Использовать `export default`.
