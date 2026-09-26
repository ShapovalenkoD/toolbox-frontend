export interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface UsersFilter {
  page: number;
  search: string;
}
