/*
  Warnings:

  - The values [INITIATED,SUCCEEDED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `coverUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `endsAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `errorCode` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `errorMessage` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `providerRef` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `checkedInAt` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `ticketTypeId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `contactPhone` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `priceFrom` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `VenueBooking` table. All the data in the column will be lost.
  - You are about to drop the column `reservedFrom` on the `VenueBooking` table. All the data in the column will be lost.
  - You are about to drop the column `reservedTo` on the `VenueBooking` table. All the data in the column will be lost.
  - You are about to drop the `EventTeamMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceOffer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TicketType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VolunteerProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[qrCode]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId]` on the table `VenueBooking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventType` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizerId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `capacity` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `commission` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `provider` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `eventId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qrCode` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tierId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `passwordHash` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `pricePerDay` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `Venue` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Venue` required. This step will fail if there are existing NULL values in that column.
  - Made the column `capacity` on table `Venue` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `endDate` to the `VenueBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `VenueBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCost` to the `VenueBooking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ORGANIZER', 'PARTICIPANT', 'ADMIN', 'VENDOR', 'VOLUNTEER');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "EventTeamMember" DROP CONSTRAINT "EventTeamMember_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventTeamMember" DROP CONSTRAINT "EventTeamMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_eventId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_ticketTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMember" DROP CONSTRAINT "OrganizationMember_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMember" DROP CONSTRAINT "OrganizationMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_eventId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceOffer" DROP CONSTRAINT "ServiceOffer_requestId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceOffer" DROP CONSTRAINT "ServiceOffer_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_ticketTypeId_fkey";

-- DropForeignKey
ALTER TABLE "TicketType" DROP CONSTRAINT "TicketType_eventId_fkey";

-- DropForeignKey
ALTER TABLE "VendorProfile" DROP CONSTRAINT "VendorProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "VendorService" DROP CONSTRAINT "VendorService_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VenueBooking" DROP CONSTRAINT "VenueBooking_eventId_fkey";

-- DropForeignKey
ALTER TABLE "VenueBooking" DROP CONSTRAINT "VenueBooking_venueId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerProfile" DROP CONSTRAINT "VolunteerProfile_userId_fkey";

-- DropIndex
DROP INDEX "Event_createdById_idx";

-- DropIndex
DROP INDEX "Event_organizationId_idx";

-- DropIndex
DROP INDEX "Event_startsAt_idx";

-- DropIndex
DROP INDEX "Payment_orderId_idx";

-- DropIndex
DROP INDEX "Payment_providerRef_key";

-- DropIndex
DROP INDEX "Payment_status_idx";

-- DropIndex
DROP INDEX "Review_authorId_idx";

-- DropIndex
DROP INDEX "Review_eventId_authorId_key";

-- DropIndex
DROP INDEX "Review_eventId_idx";

-- DropIndex
DROP INDEX "Ticket_code_key";

-- DropIndex
DROP INDEX "Ticket_ownerId_idx";

-- DropIndex
DROP INDEX "Ticket_ticketTypeId_idx";

-- DropIndex
DROP INDEX "Venue_city_idx";

-- DropIndex
DROP INDEX "VenueBooking_eventId_idx";

-- DropIndex
DROP INDEX "VenueBooking_venueId_reservedFrom_reservedTo_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "coverUrl",
DROP COLUMN "createdById",
DROP COLUMN "endsAt",
DROP COLUMN "isPrivate",
DROP COLUMN "organizationId",
DROP COLUMN "startsAt",
DROP COLUMN "timezone",
ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "eventType" TEXT NOT NULL,
ADD COLUMN     "organizerId" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "capacity" SET NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "currency",
DROP COLUMN "errorCode",
DROP COLUMN "errorMessage",
DROP COLUMN "orderId",
DROP COLUMN "providerRef",
DROP COLUMN "updatedAt",
ADD COLUMN     "commission" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "providerTxId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "provider",
ADD COLUMN     "provider" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "serviceId" TEXT,
ADD COLUMN     "venueId" TEXT,
ALTER COLUMN "eventId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "checkedInAt",
DROP COLUMN "code",
DROP COLUMN "orderId",
DROP COLUMN "ownerId",
DROP COLUMN "ticketTypeId",
ADD COLUMN     "eventId" TEXT NOT NULL,
ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "qrCode" TEXT NOT NULL,
ADD COLUMN     "tierId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
DROP COLUMN "fullName",
DROP COLUMN "isActive",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "passwordHash" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PARTICIPANT';

-- AlterTable
ALTER TABLE "Venue" DROP COLUMN "contactPhone",
DROP COLUMN "lat",
DROP COLUMN "lng",
DROP COLUMN "priceFrom",
DROP COLUMN "updatedAt",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "hasParking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSound" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasStage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasWifi" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "isIndoor" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "pricePerDay" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "capacity" SET NOT NULL;

-- AlterTable
ALTER TABLE "VenueBooking" DROP COLUMN "notes",
DROP COLUMN "reservedFrom",
DROP COLUMN "reservedTo",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalCost" DECIMAL(12,2) NOT NULL;

-- DropTable
DROP TABLE "EventTeamMember";

-- DropTable
DROP TABLE "Invoice";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "OrganizationMember";

-- DropTable
DROP TABLE "ServiceOffer";

-- DropTable
DROP TABLE "ServiceRequest";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "TicketType";

-- DropTable
DROP TABLE "VendorProfile";

-- DropTable
DROP TABLE "VendorService";

-- DropTable
DROP TABLE "VolunteerProfile";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PaymentProvider";

-- DropEnum
DROP TYPE "ServiceType";

-- DropEnum
DROP TYPE "TaskStatus";

-- DropEnum
DROP TYPE "TeamMemberRole";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "TicketTier" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "priceFrom" DECIMAL(12,2) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageUrls" TEXT[],
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventService" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "agreedPrice" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteerApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "skills" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VolunteerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventService_eventId_serviceId_key" ON "EventService"("eventId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerApplication_userId_eventId_key" ON "VolunteerApplication"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_qrCode_key" ON "Ticket"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_paymentId_key" ON "Ticket"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueBooking_eventId_key" ON "VenueBooking"("eventId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTier" ADD CONSTRAINT "TicketTier_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "TicketTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBooking" ADD CONSTRAINT "VenueBooking_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventService" ADD CONSTRAINT "EventService_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventService" ADD CONSTRAINT "EventService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerApplication" ADD CONSTRAINT "VolunteerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerApplication" ADD CONSTRAINT "VolunteerApplication_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
