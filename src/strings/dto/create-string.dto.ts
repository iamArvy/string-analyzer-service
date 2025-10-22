import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStringDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}
