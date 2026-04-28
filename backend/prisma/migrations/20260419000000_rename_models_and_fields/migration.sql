-- 1. VolunteerSkills → VolunteerSkill
ALTER TABLE "VolunteerSkills" RENAME TO "VolunteerSkill";
ALTER TABLE "VolunteerSkill" RENAME CONSTRAINT "VolunteerSkills_pkey" TO "VolunteerSkill_pkey";
ALTER INDEX "VolunteerSkills_name_key" RENAME TO "VolunteerSkill_name_key";

-- 2. SquareCharacteristics → SquareCharacteristic
ALTER TABLE "SquareCharacteristics" RENAME TO "SquareCharacteristic";
ALTER TABLE "SquareCharacteristic" RENAME CONSTRAINT "SquareCharacteristics_pkey" TO "SquareCharacteristic_pkey";
ALTER INDEX "SquareCharacteristics_name_key" RENAME TO "SquareCharacteristic_name_key";

-- 3. Fix FK in Volunteer (now references renamed table)
ALTER TABLE "Volunteer" DROP CONSTRAINT "Volunteer_skillId_fkey";
ALTER TABLE "Volunteer"
  ADD CONSTRAINT "Volunteer_skillId_fkey"
  FOREIGN KEY ("skillId") REFERENCES "VolunteerSkill"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 4. Rename join table Square ↔ SquareCharacteristic
ALTER TABLE "_SquareToSquareCharacteristics" RENAME TO "_SquareToSquareCharacteristic";
ALTER TABLE "_SquareToSquareCharacteristic"
  RENAME CONSTRAINT "_SquareToSquareCharacteristics_AB_pkey"
  TO "_SquareToSquareCharacteristic_AB_pkey";
ALTER INDEX "_SquareToSquareCharacteristics_B_index"
  RENAME TO "_SquareToSquareCharacteristic_B_index";
ALTER TABLE "_SquareToSquareCharacteristic"
  DROP CONSTRAINT IF EXISTS "_SquareToSquareCharacteristics_A_fkey";
ALTER TABLE "_SquareToSquareCharacteristic"
  DROP CONSTRAINT IF EXISTS "_SquareToSquareCharacteristics_B_fkey";
ALTER TABLE "_SquareToSquareCharacteristic"
  ADD CONSTRAINT "_SquareToSquareCharacteristic_A_fkey"
  FOREIGN KEY ("A") REFERENCES "Square"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_SquareToSquareCharacteristic"
  ADD CONSTRAINT "_SquareToSquareCharacteristic_B_fkey"
  FOREIGN KEY ("B") REFERENCES "SquareCharacteristic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. Event.bannerUrl → bannerUrls
ALTER TABLE "Event" RENAME COLUMN "bannerUrl" TO "bannerUrls";
