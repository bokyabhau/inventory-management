import { IsNotEmpty, IsString, IsDateString, IsEnum, IsNumber, IsMongoId, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RejectionItemDto {
  @IsMongoId()
  @IsNotEmpty()
  reason: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  numberOfRejections: number;
}

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RejectionItemDto)
  @IsNotEmpty()
  rejections: RejectionItemDto[];

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RejectionItemDto)
  rejections?: RejectionItemDto[];

  @IsString()
  lotNumber?: string;
}
