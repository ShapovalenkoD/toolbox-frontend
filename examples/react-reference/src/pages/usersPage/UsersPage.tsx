import { type ChangeEvent, useCallback, useMemo, useState } from "react";

import { PageLayout, Pagination, Table, TextField } from "@/components";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { useDebounce } from "@/lib/hooks";
import { useUsers } from "@/services";

import { userRowFromDto, usersParamsToDto } from "./-utils";
import { SEARCH_DEBOUNCE_MS, UsersColumns } from "./UsersPage.constants";
import type { UserRow } from "./UsersPage.interface";

import styles from "./usersPage.module.css";

const EmptyRows: UserRow[] = [];

/** Список на useQuery: страница владеет фильтром, запрос и его состояния — у TanStack Query. */
export const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const query = useUsers(usersParamsToDto({ page, search: debouncedSearch }, DEFAULT_PAGE_SIZE));
  const rows = useMemo(() => query.data?.items.map(userRowFromDto) ?? EmptyRows, [query.data]);

  const getUserRowId = useCallback((row: UserRow) => row.id, []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleRetry = () => {
    void query.refetch();
  };

  return (
    <PageLayout
      actions={
        <TextField
          label="Поиск"
          onChange={handleSearchChange}
          placeholder="Имя пользователя"
          type="search"
          value={search}
        />
      }
      description="Все, у кого есть доступ к рабочему пространству."
      title="Пользователи"
    >
      {query.isError ? (
        <div className={styles.error} role="alert">
          <span>Не удалось загрузить пользователей.</span>
          <button
            className="button button-size-sm button-variant-secondary"
            onClick={handleRetry}
            type="button"
          >
            Повторить
          </button>
        </div>
      ) : null}

      {query.isPending ? <p className={styles.status}>Загрузка…</p> : null}

      {query.isSuccess ? (
        <>
          <Table
            columns={UsersColumns}
            data={rows}
            emptyText={debouncedSearch ? "Никого не нашли" : "Пользователей пока нет"}
            getRowId={getUserRowId}
            isBusy={query.isFetching}
          />
          <Pagination
            onPageChange={setPage}
            page={page}
            pageSize={DEFAULT_PAGE_SIZE}
            total={query.data.total}
          />
        </>
      ) : null}
    </PageLayout>
  );
};
