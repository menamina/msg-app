/*
  Warnings:

  - You are about to drop the column `email` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `dltdByReciever` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerID,contactID]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerID` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "email",
ADD COLUMN     "ownerID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "dltdByReciever",
ADD COLUMN     "dltdByReceiver" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "file" TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "pfp" SET DEFAULT 'default-avatar.png',
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FriendReq" (
    "id" SERIAL NOT NULL,
    "sentBy" INTEGER NOT NULL,
    "sentTo" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FriendReq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FriendReq_sentBy_sentTo_key" ON "FriendReq"("sentBy", "sentTo");

-- CreateIndex
CREATE UNIQUE INDEX "Friends_ownerID_contactID_key" ON "Friends"("ownerID", "contactID");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendReq" ADD CONSTRAINT "FriendReq_sentBy_fkey" FOREIGN KEY ("sentBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendReq" ADD CONSTRAINT "FriendReq_sentTo_fkey" FOREIGN KEY ("sentTo") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
