/*
  Warnings:

  - You are about to drop the column `name` on the `Devices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Devices" DROP COLUMN "name",
ADD COLUMN     "CharacteristicName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "deviceName" TEXT NOT NULL DEFAULT '';
