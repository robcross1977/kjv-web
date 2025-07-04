-- AlterTable
ALTER TABLE "bookmark" ADD COLUMN     "folderId" TEXT;

-- CreateTable
CREATE TABLE "bookmark_folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "parentId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookmark_folder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookmark_folder_userId_name_parentId_key" ON "bookmark_folder"("userId", "name", "parentId");

-- AddForeignKey
ALTER TABLE "bookmark_folder" ADD CONSTRAINT "bookmark_folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "bookmark_folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark_folder" ADD CONSTRAINT "bookmark_folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "bookmark_folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
