-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('CATERING', 'DECORATION', 'SOUND', 'PHOTO', 'SECURITY');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('CLICK', 'PAYME', 'STRIPE');

-- CreateEnum
CREATE TYPE "VolunteerStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable: Service.category String -> ServiceCategory (USING cast)
ALTER TABLE "Service"
  ALTER COLUMN "category" TYPE "ServiceCategory"
  USING "category"::"ServiceCategory";

-- AlterTable: Payment.provider String -> PaymentProvider (USING cast)
ALTER TABLE "Payment"
  ALTER COLUMN "provider" TYPE "PaymentProvider"
  USING "provider"::"PaymentProvider";

-- AlterTable: VolunteerApplication.status String -> VolunteerStatus (USING cast + new default)
ALTER TABLE "VolunteerApplication"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "VolunteerStatus"
  USING "status"::"VolunteerStatus",
  ALTER COLUMN "status" SET DEFAULT 'PENDING'::"VolunteerStatus";
