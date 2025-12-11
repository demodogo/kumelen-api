-- DropForeignKey
ALTER TABLE "product_media" DROP CONSTRAINT "product_media_mediaId_fkey";

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
