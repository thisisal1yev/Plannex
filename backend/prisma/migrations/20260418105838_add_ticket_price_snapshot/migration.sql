/*
  Warnings:

  - Added the required column `pricePaid` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "pricePaid" DECIMAL(12,2) NOT NULL;
