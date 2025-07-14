import { IsString, IsUrl, IsArray, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRecipeIngredientDto {
  @ApiProperty({ description: '재료명' })
  @IsString()
  name: string;

  @ApiProperty({ description: '원본 재료명', required: false })
  @IsOptional()
  @IsString()
  original_name?: string;

  @ApiProperty({ description: '정규화된 재료명', required: false })
  @IsOptional()
  @IsString()
  normalized_name?: string;

  @ApiProperty({ description: '신뢰도' })
  @IsNumber()
  confidence: number;
}

export class CreateRecipeCuisineInfoDto {
  @ApiProperty({ description: '요리 장르' })
  @IsString()
  cuisine_type: string;

  @ApiProperty({ description: '신뢰도' })
  @IsNumber()
  confidence: number;

  @ApiProperty({ description: '판단 근거', required: false })
  @IsOptional()
  @IsString()
  reasoning?: string;
}

export class CreateRecipeMetadataDto {
  @ApiProperty({ description: '영상 제목', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '작성자명', required: false })
  @IsOptional()
  @IsString()
  author_name?: string;

  @ApiProperty({ description: '작성자 URL', required: false })
  @IsOptional()
  @IsString()
  author_url?: string;

  @ApiProperty({ description: '썸네일 URL', required: false })
  @IsOptional()
  @IsUrl()
  thumbnail_url?: string;

  @ApiProperty({ description: '비디오 ID', required: false })
  @IsOptional()
  @IsString()
  video_id?: string;
}

export class CreateRecipeDto {
  @ApiProperty({ description: 'YouTube 영상 URL' })
  @IsString()
  @IsUrl()
  youtube_url: string;

  @ApiProperty({ description: '레시피 제목', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '영상 메타데이터', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRecipeMetadataDto)
  metadata?: CreateRecipeMetadataDto;

  @ApiProperty({ description: '재료 목록', type: [CreateRecipeIngredientDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredients: CreateRecipeIngredientDto[];

  @ApiProperty({ description: '요리 장르 정보', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRecipeCuisineInfoDto)
  cuisine_info?: CreateRecipeCuisineInfoDto;

  @ApiProperty({ description: '영상 자막', required: false })
  @IsOptional()
  @IsString()
  transcript?: string;

  @ApiProperty({ description: '처리 상태' })
  @IsString()
  processing_status: string;
}