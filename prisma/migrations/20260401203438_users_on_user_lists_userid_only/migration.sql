/*
  Warnings:

  - You are about to drop the column `username` on the `UsersOnUserLists` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersOnUserLists" DROP CONSTRAINT "UsersOnUserLists_userId_username_fkey";

-- DropIndex
DROP INDEX "UsersOnUserLists_username_restrictionsSlug_key";

-- AlterTable
ALTER TABLE "UsersOnUserLists" DROP COLUMN "username";

-- AddForeignKey
ALTER TABLE "UsersOnUserLists" ADD CONSTRAINT "UsersOnUserLists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
