export interface CookieMap {
  sidebar_state?: "open" | "closed";
}

export type CookieNames = keyof CookieMap;
export type DeleteCookieProps = CookieNames;
export type SetCookieProps = {
  [Key in CookieNames]: {
    name: Key;
    value: Exclude<CookieMap[Key], undefined>;
    maxAgeSeconds?: number;
  };
}[CookieNames];
