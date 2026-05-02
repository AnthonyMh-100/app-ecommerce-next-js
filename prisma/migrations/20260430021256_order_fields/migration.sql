/*
  Warnings:

  - You are about to drop the column `taxt` on the `Order` table. All the data in the column will be lost.
  - Added the required column `tax` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "taxt",
ADD COLUMN     "tax" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "isPaid" SET DEFAULT false;
