-- DropForeignKey
ALTER TABLE "service_media" DROP CONSTRAINT "service_media_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "service_media" DROP CONSTRAINT "service_media_serviceId_fkey";

-- AddForeignKey
ALTER TABLE "service_media" ADD CONSTRAINT "service_media_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_media" ADD CONSTRAINT "service_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
