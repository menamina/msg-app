/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `pfp` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "dltdByReciever" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dltdBySender" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "id",
ADD COLUMN     "pfp" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Friends" (
    "id" SERIAL NOT NULL,
    "contactID" INTEGER NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_contactID_fkey" FOREIGN KEY ("contactID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
