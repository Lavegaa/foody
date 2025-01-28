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
    await this.prisma.userIngredient.createMany({
      data: ingredients.map((ingredient) => ({
        userId,
        ingredientId: ingredient.ingredientId,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
    });
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
