export interface UserDto {
  id: string;
  email: string;
  createdAt: string | Date;
}

export interface AuthResponse {
  user: UserDto;
}
