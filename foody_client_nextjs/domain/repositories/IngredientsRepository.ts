export interface Ingredient {
  id: string;
  name: string;
}

export class IngredientsRepository {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async getAllIngredients(): Promise<Ingredient[]> {
    const response = await fetch(`${this.baseUrl}/v1/recipes/all-ingredients`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('모든 재료 목록을 불러오는데 실패했습니다.');
    }

    return response.json();
  }
}