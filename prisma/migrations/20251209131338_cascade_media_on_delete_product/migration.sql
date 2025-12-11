-- DropForeignKey
ALTER TABLE "product_media" DROP CONSTRAINT "product_media_productId_fkey";

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
