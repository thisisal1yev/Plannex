import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { UserRole } from 'generated/prisma/enums'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string

  @IsOptional()
  @IsString()
  avatarUrl?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}