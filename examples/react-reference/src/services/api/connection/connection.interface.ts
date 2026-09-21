export interface ConnectWorkspaceRequestDto {
  connection_name: string;
  access_key: string;
}

export interface ConnectWorkspaceResponseDto {
  connection_id: string;
  connection_name: string;
  connected_at: string;
}
