-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('Movie', 'TvShow', 'TvEpisode', 'TvSeason', 'Person');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT,
    "photoURL" TEXT,
    "coverImagePath" TEXT NOT NULL DEFAULT '/movieBackdrop.jpeg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserList" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUserAddedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mediaType" "MediaType" NOT NULL,
    "item1Id" INTEGER NOT NULL,
    "item2Id" INTEGER NOT NULL,
    "item3Id" INTEGER NOT NULL,
    "item4Id" INTEGER NOT NULL,
    "item5Id" INTEGER NOT NULL,
    "restrictionsSlug" TEXT NOT NULL,

    CONSTRAINT "UserList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnUserLists" (
    "userId" TEXT NOT NULL,
    "userListId" INTEGER NOT NULL,
    "restrictionsSlug" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userAddedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersOnUserLists_pkey" PRIMARY KEY ("userId","userListId")
);

-- CreateTable
CREATE TABLE "Restrictions" (
    "slug" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "genreId" INTEGER NOT NULL DEFAULT 0,
    "year" INTEGER NOT NULL DEFAULT 0,
    "isLiveActionOnly" BOOLEAN NOT NULL DEFAULT false,
    "personId" INTEGER NOT NULL DEFAULT 0,
    "episodesTvShowId" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Restrictions_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "ListItem" (
    "mediaType" "MediaType" NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "posterPath" TEXT,
    "genreIds" INTEGER[],
    "overview" TEXT,
    "backdropPath" TEXT,
    "seasonNum" INTEGER,
    "episodeNum" INTEGER,

    CONSTRAINT "ListItem_pkey" PRIMARY KEY ("mediaType","tmdbId")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "profilePath" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TvShowLite" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "backdropPath" TEXT,
    "posterPath" TEXT,

    CONSTRAINT "TvShowLite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_username_key" ON "User"("id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "UserList_id_restrictionsSlug_key" ON "UserList"("id", "restrictionsSlug");

-- CreateIndex
CREATE UNIQUE INDEX "UserList_item1Id_item2Id_item3Id_item4Id_item5Id_restrictio_key" ON "UserList"("item1Id", "item2Id", "item3Id", "item4Id", "item5Id", "restrictionsSlug");

-- CreateIndex
CREATE UNIQUE INDEX "UsersOnUserLists_userId_restrictionsSlug_key" ON "UsersOnUserLists"("userId", "restrictionsSlug");

-- CreateIndex
CREATE UNIQUE INDEX "UsersOnUserLists_username_restrictionsSlug_key" ON "UsersOnUserLists"("username", "restrictionsSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Person_id_key" ON "Person"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TvShowLite_id_key" ON "TvShowLite"("id");

-- AddForeignKey
ALTER TABLE "UserList" ADD CONSTRAINT "UserList_mediaType_item1Id_fkey" FOREIGN KEY ("mediaType", "item1Id") REFERENCES "ListItem"("mediaType", "tmdbId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserList" ADD CONSTRAINT "UserList_mediaType_item2Id_fkey" FOREIGN KEY ("mediaType", "item2Id") REFERENCES "ListItem"("mediaType", "tmdbId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserList" ADD CONSTRAINT "UserList_mediaType_item3Id_fkey" FOREIGN KEY ("mediaType", "item3Id") REFERENCES "ListItem"("mediaType", "tmdbId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserList" ADD CONSTRAINT "UserList_mediaType_item4Id_fkey" FOREIGN KEY ("mediaType", "item4Id") REFERENCES "ListItem"("mediaType", "tmdbId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserList" ADD CONSTRAINT "UserList_mediaType_item5Id_fkey" FOREIGN KEY ("mediaType", "item5Id") REFERENCES "ListItem"("mediaType", "tmdbId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserList" ADD CONSTRAINT "UserList_restrictionsSlug_fkey" FOREIGN KEY ("restrictionsSlug") REFERENCES "Restrictions"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnUserLists" ADD CONSTRAINT "UsersOnUserLists_userId_username_fkey" FOREIGN KEY ("userId", "username") REFERENCES "User"("id", "username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnUserLists" ADD CONSTRAINT "UsersOnUserLists_userListId_restrictionsSlug_fkey" FOREIGN KEY ("userListId", "restrictionsSlug") REFERENCES "UserList"("id", "restrictionsSlug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restrictions" ADD CONSTRAINT "Restrictions_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restrictions" ADD CONSTRAINT "Restrictions_episodesTvShowId_fkey" FOREIGN KEY ("episodesTvShowId") REFERENCES "TvShowLite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
