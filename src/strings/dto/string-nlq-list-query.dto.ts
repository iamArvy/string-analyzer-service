import { IsNotEmpty, IsString } from 'class-validator';

export class StringNLQueryDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
