# Agent Instructions

Инструкции для ИИ-агента при работе с проектом.

---

## Язык

- Отвечай на русском языке.
- Комментарии в коде — на русском (если нет иного требования).
- Названия переменных, функций, файлов — на английском (это код).

---

## Работа с компонентами

### Утилиты

- **Не оставляй утилиты внутри компонента**, если они могут быть переиспользованы. Сразу выноси в `lib/utils/` или `lib/business/`.
- Если утилита используется только в одном компоненте — можно оставить рядом (`ProductCard.utils.ts`), но при первом повторном использовании — выноси в `lib/`.

### Хуки

- Хуки colocated с компонентом: `ProductCard.hooks.ts` рядом с `ProductCard.tsx`.
- Переиспользуемые хуки (используются в 2+ местах) → `lib/hooks/`.
- Не создавай хук в `lib/hooks/` ради одного компонента — сначала colocated, потом выноси.

### Barrel-экспорт

- В каждой папке `index.ts` с публичным API.
- Не экспортируй внутренние хуки, утилиты, константы, тесты, stories.

### Нейминг

- Следуй [File Naming Convention](ProjectStructure.md#file-naming-convention) из ProjectStructure.md.

---

## Ссылки на структуру

- **Перед созданием нового файла** — прочитай [ProjectStructure.md](ProjectStructure.md), чтобы понять куда он должен попасть.
- **При работе со слоем** — читай соответствующий раздел в [ProjectStructure.full.md](ProjectStructure.full.md) (секции `## app`, `## services`, `## store` и т.д.).
- **При выборе между слоями** — используй таблицу зависимостей в ProjectStructure.md (Dependency rules).
- **При написании кода** — соблюдай [CODE_STYLE_GUIDE.md](CODE_STYLE_GUIDE.md): именование, type assertions, экспорт, поля классов.

### Как ссылаться

При ответе пользователю ссылайся на конкретные секции:

- `[секция services](ProjectStructure.full.md#services---работа-с-side-эффектами)`
- `[File Naming Convention](ProjectStructure.md#file-naming-convention)`

---

## Конвертация данных

### Принцип

При получении данных извне (API, REST, localStorage, cookies) — если "сырые" данные не подходят для использования в коде, **конвертируй их по месту использования** через утилиту-конвертер. Это не валидация через схему — это **конвертация/нормализация** данных.

Аналогично при отправке данных (формы, API-запросы) — если данные нужно преобразовать перед отправкой, используй отдельную утилиту.

### Нейминг конвертеров (фиксированный на весь проект)

| Направление                         | Название файла       | Пример           |
| ----------------------------------- | -------------------- | ---------------- |
| Входящие данные (API → приложение)  | `{entity}FromDto.ts` | `userFromDto.ts` |
| Исходящие данные (приложение → API) | `{entity}ToDto.ts`   | `userToDto.ts`   |

**Правила**:

- Названия конвертеров **фиксированы**: `fromDto` для входящих, `toDto` для исходящих. Не `normalize`, не `adapt`, не `transform` — только `fromDto`/`toDto`.
- Конвертеры **не выносятся в общие слои** (`lib/`, `services/`). Они живут **рядом с местом использования**:
  - Конвертер на странице → `app/profilePage/utils/userFromDto.ts`
  - Конвертер в компоненте → `components/features/cards/productCard/utils/productFromDto.ts`
- **Store не хранит данные из API.** API-методы импортируются из `services/api/` напрямую по месту вызова (страница, feature-компонент). Конвертация `fromDto` происходит там же — по месту.
- **Нет общего слоя query hooks.** React Query/SWR, если используется, оборачивает вызов API по месту, а не в `lib/hooks/queries/`.
- Один конвертер = одна сущность. Не создавай `convertAll.ts` — каждый `userFromDto.ts`, `productFromDto.ts`, `orderFromDto.ts` отдельно.

### Пример

```ts
// store/user/utils/userFromDto.ts

import type { UserResponseDto } from "@/services/types/response.interface";
import type { User } from "../types";

export const userFromDto = (dto: UserResponseDto): User => ({
  id: String(dto.id),
  firstName: dto.first_name,
  createdAt: new Date(dto.created_at),
});
```

```ts
// app/profilePage/utils/userToDto.ts

import type { UserFormValues } from "../types";
import type { UserRequestDto } from "@/services/types/request.interface";

export const userToDto = (form: UserFormValues): UserRequestDto => ({
  first_name: form.firstName,
  email: form.email,
});
```

---

## Рефакторинг

- **Перед изменением существующего кода** — проверь dependency rules в ProjectStructure.md. Не нарушай границы слоёв.
- **При переносе файла** — проверь, что импорты в других файлах не сломались.
- **При добавлении нового импорта** — убедись, что он разрешён dependency rules (таблица запрещённых зависимостей).
- **Не предлагай FSD** (Feature-Sliced Design) — проект использует свою архитектуру, описанную в ProjectStructure.md.
- **Не используй `export default`** — только именованный экспорт.
