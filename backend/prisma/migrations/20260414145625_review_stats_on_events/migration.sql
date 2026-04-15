/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `RatingStats` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RatingStats" ADD COLUMN     "eventId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RatingStats_eventId_key" ON "RatingStats"("eventId");

-- AddForeignKey
ALTER TABLE "RatingStats" ADD CONSTRAINT "RatingStats_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
