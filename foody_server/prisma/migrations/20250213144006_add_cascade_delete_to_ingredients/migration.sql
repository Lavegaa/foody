-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "step_ingredients" DROP CONSTRAINT "step_ingredients_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "user_ingredients" DROP CONSTRAINT "user_ingredients_ingredientId_fkey";

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_ingredients" ADD CONSTRAINT "step_ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ingredients" ADD CONSTRAINT "user_ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
