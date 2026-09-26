import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { LoadingButton, TextField } from "@/components/ui";

import type { ConnectionFormValues } from "../../ConnectionPage.interface";

import type { ConnectionFormProps } from "./ConnectionForm.interface";
import { ConnectionFormSchema } from "./ConnectionForm.schema";

import styles from "./connectionForm.module.css";

export const ConnectionForm = (props: ConnectionFormProps) => {
  const { error, onConnect, pending } = props;

  const { formState, handleSubmit, register } = useForm<ConnectionFormValues>({
    defaultValues: { accessKey: "", name: "" },
    resolver: zodResolver(ConnectionFormSchema),
  });

  const disabled = pending || formState.isSubmitting;

  return (
    <form
      aria-busy={disabled}
      className={styles.form}
      noValidate
      onSubmit={handleSubmit(onConnect)}
    >
      <fieldset className={styles.fields} disabled={disabled}>
        <TextField
          autoComplete="organization"
          error={formState.errors.name?.message}
          label="Название подключения"
          placeholder="Например, моя команда"
          {...register("name")}
        />

        <TextField
          autoComplete="off"
          error={formState.errors.accessKey?.message}
          hint="Код, который вы получили от администратора."
          label="Код доступа"
          type="password"
          {...register("accessKey")}
        />
      </fieldset>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <LoadingButton loading={disabled} type="submit">
        Подключиться
      </LoadingButton>
    </form>
  );
};
