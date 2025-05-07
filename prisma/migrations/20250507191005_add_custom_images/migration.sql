-- AlterTable
ALTER TABLE "UsersOnUserLists" ADD COLUMN     "customBackdrops" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "customPosters" TEXT[] DEFAULT ARRAY[]::TEXT[];
