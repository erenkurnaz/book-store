import { User, UserRole } from '../../../../database/user';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UserUpdateDto
  implements Pick<User, 'email' | 'password' | 'fullName' | 'role'>
{
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}
