import { useConnectWorkspace } from "@/services";

import { ConnectionForm } from "./-components";
import { connectionErrorMessage, connectionFromDto, connectionToDto } from "./-utils";
import type { ConnectionFormValues } from "./ConnectionPage.interface";

import styles from "./connectionPage.module.css";

export const ConnectionPage = () => {
  const mutation = useConnectWorkspace();
  const connection = mutation.data ? connectionFromDto(mutation.data) : null;
  const error = mutation.isError ? connectionErrorMessage(mutation.error) : undefined;

  const handleConnect = async (values: ConnectionFormValues): Promise<void> => {
    try {
      await mutation.mutateAsync(connectionToDto(values));
    } catch {
      // Ошибка хранится в mutation и отображается рядом с формой.
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>
          <span aria-hidden="true" className={styles.mark}>
            w
          </span>
          workspace
        </span>
        <span className={styles.caption}>Место для вашей команды</span>
      </header>

      <section aria-labelledby="connection-title" className={styles.panel}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>НАЧНЁМ РАБОТУ</span>
          <h1 id="connection-title">
            Всё начинается
            <br />с подключения.
          </h1>
          <p>Добавьте рабочее пространство, чтобы собрать всё важное в одном месте.</p>
        </div>

        <div className={styles.card}>
          <h2>Ваше пространство</h2>
          <p className={styles.description}>Всего два поля — и можно продолжать.</p>

          <ConnectionForm error={error} onConnect={handleConnect} pending={mutation.isPending} />

          {connection && (
            <div className={styles.success} role="status">
              <strong>{connection.title} подключено</strong>
              <span>Готово к работе · {connection.connectedAt}</span>
            </div>
          )}
        </div>
      </section>

      <footer className={styles.footer}>Спокойный интерфейс. Понятный следующий шаг.</footer>
    </main>
  );
};
