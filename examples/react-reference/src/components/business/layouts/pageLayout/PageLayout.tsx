import type { PageLayoutProps } from "./PageLayout.interface";

import styles from "./pageLayout.module.css";

/** Области рабочей страницы приложения: заголовок, действия и основное содержимое. */
export const PageLayout = (props: PageLayoutProps) => {
  const { actions, children, description, title } = props;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{title}</h1>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>

        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </header>

      <div className={styles.content}>{children}</div>
    </main>
  );
};
