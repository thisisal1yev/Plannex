/*
  Warnings:

  - You are about to drop the column `hasParking` on the `Square` table. All the data in the column will be lost.
  - You are about to drop the column `hasSound` on the `Square` table. All the data in the column will be lost.
  - You are about to drop the column `hasStage` on the `Square` table. All the data in the column will be lost.
  - You are about to drop the column `hasWifi` on the `Square` table. All the data in the column will be lost.
  - You are about to drop the column `isIndoor` on the `Square` table. All the data in the column will be lost.
  - Added the required column `squareCharacteristicsId` to the `Square` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Square" DROP COLUMN "hasParking",
DROP COLUMN "hasSound",
DROP COLUMN "hasStage",
DROP COLUMN "hasWifi",
DROP COLUMN "isIndoor",
ADD COLUMN     "squareCharacteristicsId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SquareCharacteristics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SquareCharacteristics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SquareCharacteristics_name_key" ON "SquareCharacteristics"("name");

-- AddForeignKey
ALTER TABLE "Square" ADD CONSTRAINT "Square_squareCharacteristicsId_fkey" FOREIGN KEY ("squareCharacteristicsId") REFERENCES "SquareCharacteristics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
