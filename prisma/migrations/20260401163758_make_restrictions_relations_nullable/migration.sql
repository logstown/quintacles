-- DropForeignKey
ALTER TABLE "Restrictions" DROP CONSTRAINT "Restrictions_episodesTvShowId_fkey";

-- DropForeignKey
ALTER TABLE "Restrictions" DROP CONSTRAINT "Restrictions_networkId_fkey";

-- DropForeignKey
ALTER TABLE "Restrictions" DROP CONSTRAINT "Restrictions_personId_fkey";

-- AlterTable
ALTER TABLE "Restrictions"
  ALTER COLUMN "personId" DROP NOT NULL,
  ALTER COLUMN "personId" DROP DEFAULT,
  ALTER COLUMN "episodesTvShowId" DROP NOT NULL,
  ALTER COLUMN "episodesTvShowId" DROP DEFAULT,
  ALTER COLUMN "networkId" DROP NOT NULL,
  ALTER COLUMN "networkId" DROP DEFAULT;

-- Backfill sentinel values to NULL
UPDATE "Restrictions" SET "personId" = NULL WHERE "personId" = 0;
UPDATE "Restrictions" SET "episodesTvShowId" = NULL WHERE "episodesTvShowId" = 0;
UPDATE "Restrictions" SET "networkId" = NULL WHERE "networkId" = 0;

-- AddForeignKey
ALTER TABLE "Restrictions" ADD CONSTRAINT "Restrictions_personId_fkey"
  FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restrictions" ADD CONSTRAINT "Restrictions_episodesTvShowId_fkey"
  FOREIGN KEY ("episodesTvShowId") REFERENCES "TvShowLite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restrictions" ADD CONSTRAINT "Restrictions_networkId_fkey"
  FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE SET NULL ON UPDATE CASCADE;
