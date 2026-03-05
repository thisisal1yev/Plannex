import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

enum RegisterRole {
  ORGANIZER = 'ORGANIZER',
  PARTICIPANT = 'PARTICIPANT',
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'SecurePass123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    enum: RegisterRole,
    default: RegisterRole.PARTICIPANT,
  })
  @IsOptional()
  @IsEnum(RegisterRole)
  role?: RegisterRole;
}
