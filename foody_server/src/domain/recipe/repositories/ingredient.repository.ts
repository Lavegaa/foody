import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/services/prisma/prisma.service';
import { Ingredient, UserIngredient } from '@prisma/client';
import SimpleResponseDto from 'src/domain/common/dtos/SimpleResponseDto';
import { UserIngredientDto } from '../dtos/ingredient.dto';

@Injectable()
export default class IngredientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getIngredients(): Promise<Ingredient[]> {
    return await this.prisma.ingredient.findMany();
  }

  async getIngredientById(id: number): Promise<Ingredient> {
    return await this.prisma.ingredient.findUnique({
      where: { id },
    });
  }

  async createUserIngredient(
    ingredients: UserIngredientDto[],
    userId: string,
  ): Promise<SimpleResponseDto> {
    for (const ingredientDto of ingredients) {
      // 1. 재료 찾거나 생성
      const ingredient = await this.prisma.ingredient.upsert({
        where: { name: ingredientDto.name },
        update: {},
        create: { name: ingredientDto.name },
      });

      // 2. 사용자 재료 생성 (중복 방지)
      await this.prisma.userIngredient.upsert({
        where: {
          userId_ingredientId: {
            userId,
            ingredientId: ingredient.id,
          },
        },
        update: {
          quantity: ingredientDto.quantity,
          unit: ingredientDto.unit,
        },
        create: {
          userId,
          ingredientId: ingredient.id,
          quantity: ingredientDto.quantity,
          unit: ingredientDto.unit,
        },
      });
    }
    
    return new SimpleResponseDto();
  }

  async getUserIngredients(userId: string): Promise<UserIngredient[]> {
    return await this.prisma.userIngredient.findMany({
      where: {
        userId,
      },
      include: {
        ingredient: true,
      },
    });
  }

  async deleteUserIngredient(
    ingredientId: number,
    userId: string,
  ): Promise<SimpleResponseDto> {
    await this.prisma.userIngredient.delete({
      where: {
        userId_ingredientId: {
          userId,
          ingredientId,
        },
      },
    });
    return new SimpleResponseDto();
  }
}
