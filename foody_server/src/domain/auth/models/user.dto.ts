export class UserDto {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
}

export class CreateUserDto {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

export class UpdateUserDto {
  name?: string;
  profileImage?: string;
  isActive?: boolean;
}

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
}