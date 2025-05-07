/*
  Warnings:

  - You are about to drop the column `customBackdrops` on the `UsersOnUserLists` table. All the data in the column will be lost.
  - You are about to drop the column `customPosters` on the `UsersOnUserLists` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsersOnUserLists" DROP COLUMN "customBackdrops",
DROP COLUMN "customPosters";
