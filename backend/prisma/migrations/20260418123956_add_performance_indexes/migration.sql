-- DropIndex
DROP INDEX "Review_authorId_eventId_key";

-- DropIndex
DROP INDEX "Review_authorId_serviceId_key";

-- DropIndex
DROP INDEX "Review_authorId_squareId_key";

-- CreateIndex
CREATE INDEX "Booking_userId_status_createdAt_idx" ON "Booking"("userId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Booking_squareId_status_startDate_endDate_idx" ON "Booking"("squareId", "status", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "Event_status_startDate_idx" ON "Event"("status", "startDate");

-- CreateIndex
CREATE INDEX "Event_status_eventType_startDate_idx" ON "Event"("status", "eventType", "startDate");

-- CreateIndex
CREATE INDEX "Event_organizerId_createdAt_idx" ON "Event"("organizerId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Event_squareId_idx" ON "Event"("squareId");

-- CreateIndex
CREATE INDEX "Payment_userId_createdAt_idx" ON "Payment"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Payment_status_createdAt_idx" ON "Payment"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Review_squareId_createdAt_idx" ON "Review"("squareId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Review_serviceId_createdAt_idx" ON "Review"("serviceId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Review_eventId_createdAt_idx" ON "Review"("eventId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Service_city_categoryId_idx" ON "Service"("city", "categoryId");

-- CreateIndex
CREATE INDEX "Service_city_priceFrom_idx" ON "Service"("city", "priceFrom");

-- CreateIndex
CREATE INDEX "Service_vendorId_idx" ON "Service"("vendorId");

-- CreateIndex
CREATE INDEX "Square_city_categoryId_idx" ON "Square"("city", "categoryId");

-- CreateIndex
CREATE INDEX "Square_city_capacity_idx" ON "Square"("city", "capacity");

-- CreateIndex
CREATE INDEX "Square_city_pricePerDay_idx" ON "Square"("city", "pricePerDay");

-- CreateIndex
CREATE INDEX "Square_ownerId_idx" ON "Square"("ownerId");

-- CreateIndex
CREATE INDEX "Ticket_userId_createdAt_idx" ON "Ticket"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Ticket_userId_isUsed_idx" ON "Ticket"("userId", "isUsed");

-- CreateIndex
CREATE INDEX "Ticket_eventId_tierId_idx" ON "Ticket"("eventId", "tierId");

-- CreateIndex
CREATE INDEX "Volunteer_userId_status_idx" ON "Volunteer"("userId", "status");

-- CreateIndex
CREATE INDEX "Volunteer_eventId_status_idx" ON "Volunteer"("eventId", "status");
