export interface LocalStorageMap {
  test?: "foo" | "bar";
}

export type LocalStorageNames = keyof LocalStorageMap;
export type DeleteLocalStorageProps = LocalStorageNames;
export type SetLocalStorageProps = {
  [Key in LocalStorageNames]: { name: Key; value: Exclude<LocalStorageMap[Key], undefined> };
}[LocalStorageNames];
