-- CreateIndex
CREATE INDEX "Restrictions_mediaType_idx" ON "Restrictions"("mediaType");

-- CreateIndex
CREATE INDEX "Restrictions_personId_idx" ON "Restrictions"("personId");

-- CreateIndex
CREATE INDEX "Restrictions_episodesTvShowId_idx" ON "Restrictions"("episodesTvShowId");

-- CreateIndex
CREATE INDEX "Restrictions_networkId_idx" ON "Restrictions"("networkId");

-- CreateIndex
CREATE INDEX "UserList_restrictionsSlug_idx" ON "UserList"("restrictionsSlug");

-- CreateIndex
CREATE INDEX "UserList_lastUserAddedAt_idx" ON "UserList"("lastUserAddedAt");

-- CreateIndex
CREATE INDEX "UsersOnUserLists_userId_idx" ON "UsersOnUserLists"("userId");

-- CreateIndex
CREATE INDEX "UsersOnUserLists_userListId_idx" ON "UsersOnUserLists"("userListId");

-- CreateIndex
CREATE INDEX "UsersOnUserLists_restrictionsSlug_idx" ON "UsersOnUserLists"("restrictionsSlug");
