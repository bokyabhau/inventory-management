import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRejectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateRejectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}