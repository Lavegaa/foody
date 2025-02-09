/*
  Warnings:

  - Added the required column `userId` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_authorId_fkey";

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "authorName" VARCHAR(100) NOT NULL,
    "authorUrl" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
