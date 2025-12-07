/*
  Warnings:

  - You are about to drop the column `description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "description",
ADD COLUMN     "long_desc" TEXT,
ADD COLUMN     "short_desc" TEXT;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "description",
ADD COLUMN     "long_desc" TEXT,
ADD COLUMN     "short_desc" TEXT;
