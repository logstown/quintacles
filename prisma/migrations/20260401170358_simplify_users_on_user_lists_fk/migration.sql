-- DropForeignKey
ALTER TABLE "UsersOnUserLists" DROP CONSTRAINT "UsersOnUserLists_userListId_restrictionsSlug_fkey";

-- DropIndex
DROP INDEX "UserList_id_restrictionsSlug_key";

-- AddForeignKey
ALTER TABLE "UsersOnUserLists" ADD CONSTRAINT "UsersOnUserLists_userListId_fkey" FOREIGN KEY ("userListId") REFERENCES "UserList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
