/*
  Warnings:

  - You are about to drop the column `long_desc` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `short_desc` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "long_desc",
DROP COLUMN "short_desc",
ADD COLUMN     "longDesc" TEXT,
ADD COLUMN     "shortDesc" TEXT;
