-- AlterTable
ALTER TABLE "Restrictions" ADD COLUMN     "networkId" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Network" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "logoPath" TEXT,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Network" VALUES
    (0, '');

-- CreateIndex
CREATE UNIQUE INDEX "Network_id_key" ON "Network"("id");

-- AddForeignKey
ALTER TABLE "Restrictions" ADD CONSTRAINT "Restrictions_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
