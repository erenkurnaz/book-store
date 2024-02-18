import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class BookFilterQuery {
  @IsOptional()
  @IsString()
  keyword: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  available: boolean;
}
