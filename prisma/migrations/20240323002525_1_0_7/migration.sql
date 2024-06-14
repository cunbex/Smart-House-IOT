/*
  Warnings:

  - Added the required column `topics` to the `Controller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Controller" ADD COLUMN     "topics" TEXT NOT NULL;
