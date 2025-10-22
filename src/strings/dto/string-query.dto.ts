import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class StringQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    throw new BadRequestException(
      `Invalid value '${value}' for is_palindrome. Expected "true" or "false".`,
    );
  })
  is_palindrome?: boolean;

  @IsOptional()
  @IsInt()
  min_length: number;

  @IsOptional()
  @IsInt()
  max_length: number;

  @IsOptional()
  @IsInt()
  word_count: number;

  @IsOptional()
  @IsString()
  @Length(1, 1, { message: 'contains_character must be exactly one character' })
  contains_character: string;
}
