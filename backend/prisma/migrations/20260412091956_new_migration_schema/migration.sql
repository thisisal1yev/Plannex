/*
  Warnings:

  - You are about to drop the column `rating` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `sold` on the `TicketTier` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[authorId,eventId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,venueId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,serviceId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Made the column `vendorId` on table `Service` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ownerId` on table `Venue` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `VenueBooking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_paymentId_fkey";

-- DropIndex
DROP INDEX "Ticket_paymentId_key";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "rating";

-- Fix: remove services with NULL vendorId before making it NOT NULL
DELETE FROM "EventService" WHERE "serviceId" IN (SELECT id FROM "Service" WHERE "vendorId" IS NULL);
DELETE FROM "Review" WHERE "serviceId" IN (SELECT id FROM "Service" WHERE "vendorId" IS NULL);
DELETE FROM "Service" WHERE "vendorId" IS NULL;
ALTER TABLE "Service" ALTER COLUMN "vendorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "paymentId";

-- AlterTable
ALTER TABLE "TicketTier" DROP COLUMN "sold";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "activeRole" "Role" NOT NULL DEFAULT 'PARTICIPANT',
ADD COLUMN     "roles" "Role"[] DEFAULT ARRAY['PARTICIPANT']::"Role"[];

-- AlterTable
ALTER TABLE "Venue" DROP COLUMN "rating";

-- Fix: remove venues with NULL ownerId before making it NOT NULL
DELETE FROM "VenueBooking" WHERE "venueId" IN (SELECT id FROM "Venue" WHERE "ownerId" IS NULL);
DELETE FROM "Review" WHERE "venueId" IN (SELECT id FROM "Venue" WHERE "ownerId" IS NULL);
DELETE FROM "Event" WHERE "venueId" IN (SELECT id FROM "Venue" WHERE "ownerId" IS NULL);
DELETE FROM "Venue" WHERE "ownerId" IS NULL;
ALTER TABLE "Venue" ALTER COLUMN "ownerId" SET NOT NULL;

-- Fix: add userId as nullable first, backfill from Event.organizerId, then set NOT NULL
ALTER TABLE "VenueBooking" ADD COLUMN "userId" TEXT;
UPDATE "VenueBooking" vb
SET "userId" = e."organizerId"
FROM "Event" e
WHERE vb."eventId" = e.id;
ALTER TABLE "VenueBooking" ALTER COLUMN "userId" SET NOT NULL;

-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "TicketPayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "commission" DECIMAL(12,2) NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerTxId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueBookingPayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "venueBookingId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "commission" DECIMAL(12,2) NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerTxId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VenueBookingPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventServiceId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "commission" DECIMAL(12,2) NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerTxId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServicePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingStats" (
    "id" TEXT NOT NULL,
    "venueId" TEXT,
    "serviceId" TEXT,
    "avg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "count" INTEGER NOT NULL DEFAULT 0,
    "one" INTEGER NOT NULL DEFAULT 0,
    "two" INTEGER NOT NULL DEFAULT 0,
    "three" INTEGER NOT NULL DEFAULT 0,
    "four" INTEGER NOT NULL DEFAULT 0,
    "five" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RatingStats_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ratingStats_one_target_check" CHECK (
        ("venueId" IS NOT NULL AND "serviceId" IS NULL) OR
        ("venueId" IS NULL AND "serviceId" IS NOT NULL)
    )
);

-- CreateIndex
CREATE UNIQUE INDEX "TicketPayment_ticketId_key" ON "TicketPayment"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueBookingPayment_venueBookingId_key" ON "VenueBookingPayment"("venueBookingId");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePayment_eventServiceId_key" ON "ServicePayment"("eventServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "RatingStats_venueId_key" ON "RatingStats"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "RatingStats_serviceId_key" ON "RatingStats"("serviceId");

-- Fix: remove duplicate reviews before creating unique indexes (keep oldest per group)
DELETE FROM "Review" r1
WHERE r1."eventId" IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM "Review" r2
    WHERE r2."authorId" = r1."authorId"
      AND r2."eventId" = r1."eventId"
      AND r2."id" < r1."id"
  );

DELETE FROM "Review" r1
WHERE r1."venueId" IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM "Review" r2
    WHERE r2."authorId" = r1."authorId"
      AND r2."venueId" = r1."venueId"
      AND r2."id" < r1."id"
  );

DELETE FROM "Review" r1
WHERE r1."serviceId" IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM "Review" r2
    WHERE r2."authorId" = r1."authorId"
      AND r2."serviceId" = r1."serviceId"
      AND r2."id" < r1."id"
  );

-- CreateIndex
CREATE UNIQUE INDEX "Review_authorId_eventId_key" ON "Review"("authorId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_authorId_venueId_key" ON "Review"("authorId", "venueId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_authorId_serviceId_key" ON "Review"("authorId", "serviceId");

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBooking" ADD CONSTRAINT "VenueBooking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBooking" ADD CONSTRAINT "VenueBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketPayment" ADD CONSTRAINT "TicketPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketPayment" ADD CONSTRAINT "TicketPayment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBookingPayment" ADD CONSTRAINT "VenueBookingPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBookingPayment" ADD CONSTRAINT "VenueBookingPayment_venueBookingId_fkey" FOREIGN KEY ("venueBookingId") REFERENCES "VenueBooking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePayment" ADD CONSTRAINT "ServicePayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePayment" ADD CONSTRAINT "ServicePayment_eventServiceId_fkey" FOREIGN KEY ("eventServiceId") REFERENCES "EventService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingStats" ADD CONSTRAINT "RatingStats_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingStats" ADD CONSTRAINT "RatingStats_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
