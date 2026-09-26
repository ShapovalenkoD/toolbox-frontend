export interface UserDto {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface UsersListRequestDto {
  page: number;
  page_size: number;
  search?: string;
}

export interface UsersListResponseDto {
  items: UserDto[];
  total: number;
}
