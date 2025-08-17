import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsUUID('4', { each: true })
  @ArrayNotEmpty()
  @IsArray()
  ingredients: string[];
}
