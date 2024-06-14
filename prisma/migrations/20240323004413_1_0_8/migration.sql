-- AlterTable
ALTER TABLE "Controller" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Controller" ADD CONSTRAINT "Controller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
