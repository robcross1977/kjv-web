/*
  Warnings:

  - The primary key for the `bookmark` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chapter` on the `bookmark` table. All the data in the column will be lost.
  - You are about to drop the column `verse` on the `bookmark` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,name]` on the table `bookmark` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `bookmark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `normalizedRef` to the `bookmark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalRef` to the `bookmark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startChapter` to the `bookmark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `bookmark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookmark" DROP CONSTRAINT "bookmark_pkey",
DROP COLUMN "chapter",
DROP COLUMN "verse",
ADD COLUMN     "accessCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endChapter" INTEGER,
ADD COLUMN     "endVerse" INTEGER,
ADD COLUMN     "lastAccessed" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "normalizedRef" TEXT NOT NULL,
ADD COLUMN     "originalRef" TEXT NOT NULL,
ADD COLUMN     "startChapter" INTEGER NOT NULL,
ADD COLUMN     "startVerse" INTEGER,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "bookmark_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "bookmark_id_seq";

-- CreateTable
CREATE TABLE "read_verse" (
    "id" TEXT NOT NULL,
    "book" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "verse" INTEGER NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "read_verse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "read_verse_userId_book_chapter_verse_key" ON "read_verse"("userId", "book", "chapter", "verse");

-- CreateIndex
CREATE UNIQUE INDEX "bookmark_userId_name_key" ON "bookmark"("userId", "name");

-- AddForeignKey
ALTER TABLE "read_verse" ADD CONSTRAINT "read_verse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
