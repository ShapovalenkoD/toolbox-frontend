export type UnionToObjectMap<Union extends { [K in Key]: string }, Key extends keyof Union> = {
  [K in Union[Key]]: Extract<Union, { [P in Key]: K }>;
};
