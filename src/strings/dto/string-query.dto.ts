import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StringQueryDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPalindrome?: boolean;

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
