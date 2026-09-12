# store/ — Правила

## Что это
Глобальный стейт-менеджмент: слайсы, selectors, thunks, async-логика.

## Структура
```
store/
  ├── store.ts               # Создание store + middleware
  ├── rootReducer.ts         # Объединение слайсов
  ├── middleware.ts           # Кастомные middleware
  ├── types.ts                # Типы состояния и dispatch
  └── [domain]/
      ├── [domain]Slice.ts
      ├── [domain]Selectors.ts
      ├── [domain]Thunks.ts
      └── utils/
          └── [domain]Converter.ts
```

## Правила
- **Не импортирует** из `components/`, `services/`, `app/`.
- Хранит только **бизнес-модели**, никогда DTO.
- Конвертация DTO → бизнес-модель **в async-операции** (до записи в store).
- Async-логика живёт **в store**, не в компонентах.

## Нельзя
- Импортировать `components/`, `services/`, `app/`.
- Хранить DTO в store.
- Класть async-логику в компоненты.
