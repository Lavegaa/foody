import { Injectable, NotFoundException } from '@nestjs/common';
import IngredientRepository from '../repositories/ingredient.repository';

@Injectable()
export default class UserIngredientListUc {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  async execute(userId: string) {
    const ingredients =
      await this.ingredientRepository.getUserIngredients(userId);
    if (!ingredients) {
      throw new NotFoundException('Ingredients not found');
    }
    return ingredients;
  }
}
