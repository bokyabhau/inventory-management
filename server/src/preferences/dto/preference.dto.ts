import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePreferenceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpdatePreferenceDto {
  @IsString()
  value?: string;
}
