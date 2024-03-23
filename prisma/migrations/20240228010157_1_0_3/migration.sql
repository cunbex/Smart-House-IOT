/*
  Warnings:

  - You are about to drop the column `picturePath` on the `User` table. All the data in the column will be lost.
  - Added the required column `picture` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "picturePath",
ADD COLUMN     "picture" TEXT NOT NULL;
