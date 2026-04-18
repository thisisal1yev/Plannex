-- DropForeignKey
ALTER TABLE "Square" DROP CONSTRAINT "Square_squareCharacteristicsId_fkey";

-- CreateTable
CREATE TABLE "_SquareToSquareCharacteristics" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SquareToSquareCharacteristics_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SquareToSquareCharacteristics_B_index" ON "_SquareToSquareCharacteristics"("B");

-- AddForeignKey
ALTER TABLE "_SquareToSquareCharacteristics" ADD CONSTRAINT "_SquareToSquareCharacteristics_A_fkey" FOREIGN KEY ("A") REFERENCES "Square"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SquareToSquareCharacteristics" ADD CONSTRAINT "_SquareToSquareCharacteristics_B_fkey" FOREIGN KEY ("B") REFERENCES "SquareCharacteristics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
