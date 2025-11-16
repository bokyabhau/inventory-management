import { IsNotEmpty, IsString, IsDateString, IsEnum, IsNumber, IsMongoId, Min } from 'class-validator';

export class CreateDataEntryDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(['Day', 'Night'])
  @IsNotEmpty()
  shift: string;

  @IsString()
  @IsNotEmpty()
  inspectorName: string;

  @IsMongoId()
  @IsNotEmpty()
  part: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  numberOfParts: number;

  @IsMongoId()
  @IsNotEmpty()
  rejection: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  numberOfRejections: number;

  @IsString()
  @IsNotEmpty()
  lotNumber: string;
}

export class UpdateDataEntryDto {
  @IsDateString()
  date?: string;

  @IsEnum(['Day', 'Night'])
  shift?: string;

  @IsString()
  inspectorName?: string;

  @IsMongoId()
  part?: string;

  @IsNumber()
  @Min(0)
  numberOfParts?: number;

  @IsMongoId()
  rejection?: string;

  @IsNumber()
  @Min(0)
  numberOfRejections?: number;

  @IsString()
  lotNumber?: string;
}
