-- AlterTable
ALTER TABLE "Controller" ADD COLUMN     "password" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Devices" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "controllerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Devices_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Devices_uuid_key" ON "Devices"("uuid");

-- AddForeignKey
ALTER TABLE "Devices" ADD CONSTRAINT "Devices_controllerId_fkey" FOREIGN KEY ("controllerId") REFERENCES "Controller"("id") ON DELETE SET NULL ON UPDATE CASCADE;
