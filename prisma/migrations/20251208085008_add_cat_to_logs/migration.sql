/*
  Warnings:

  - You are about to drop the column `createdById` on the `categories` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('USER', 'PRODUCT', 'SERVICE', 'SALE', 'CUSTOMER', 'POS_SESSION', 'CATEGORY', 'AUTH', 'BLOG');

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_createdById_fkey";

-- DropForeignKey
ALTER TABLE "pos_sessions" DROP CONSTRAINT "pos_sessions_openedById_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "createdById";

-- CreateTable
CREATE TABLE "app_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_openedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_openedBy_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_openedBy_B_index" ON "_openedBy"("B");

-- AddForeignKey
ALTER TABLE "app_logs" ADD CONSTRAINT "app_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_openedBy" ADD CONSTRAINT "_openedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "pos_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_openedBy" ADD CONSTRAINT "_openedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
