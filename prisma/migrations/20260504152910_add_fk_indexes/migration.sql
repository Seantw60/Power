-- CreateIndex
CREATE INDEX "members_gymOwnerId_idx" ON "members"("gymOwnerId");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "workout_items_workoutId_idx" ON "workout_items"("workoutId");

-- CreateIndex
CREATE INDEX "workouts_memberId_idx" ON "workouts"("memberId");

-- CreateIndex
CREATE INDEX "workouts_userId_idx" ON "workouts"("userId");
