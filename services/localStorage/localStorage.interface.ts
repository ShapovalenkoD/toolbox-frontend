export interface LocalStorageMap {
  test?: "foo" | "bar";
}

export type LocalStorageNames = keyof LocalStorageMap;

export type DeleteLocalStorageProps = LocalStorageNames;

type ToNameMapToUnion<T> = {
  [K in keyof T]: { name: K; value: T[K] };
}[keyof T];

export type SetLocalStorageProps = ToNameMapToUnion<Required<LocalStorageMap>>;
