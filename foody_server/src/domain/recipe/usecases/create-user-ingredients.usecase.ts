import { Injectable } from '@nestjs/common';
import IngredientRepository from '../repositories/ingredient.repository';
import { UserIngredientDto } from '../dtos/ingredient.dto';

@Injectable()
export default class CreateUserIngredientsUc {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  async execute(ingredients: UserIngredientDto[], userId: string) {
    const response = await this.ingredientRepository.createUserIngredient(
      ingredients,
      userId,
    );
    return response;
  }
}
