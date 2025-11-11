import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdatePartDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}