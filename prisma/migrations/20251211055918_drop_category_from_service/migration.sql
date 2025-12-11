/*
  Warnings:

  - You are about to drop the column `categoryId` on the `services` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_categoryId_fkey";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "categoryId";
