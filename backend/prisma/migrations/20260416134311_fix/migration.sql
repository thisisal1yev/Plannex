/*
  Warnings:

  - You are about to drop the column `squareCharacteristicsId` on the `Square` table. All the data in the column will be lost.
  - Added the required column `characteristicsId` to the `Square` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Square" DROP COLUMN "squareCharacteristicsId",
ADD COLUMN     "characteristicsId" TEXT NOT NULL;
