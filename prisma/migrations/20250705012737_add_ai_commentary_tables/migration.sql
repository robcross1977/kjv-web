-- CreateTable
CREATE TABLE "chapter_commentary" (
    "id" TEXT NOT NULL,
    "book" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "context" TEXT NOT NULL,
    "speaker" TEXT,
    "topics" TEXT[],
    "culture" TEXT,
    "history" TEXT,
    "commentary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "model" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',

    CONSTRAINT "chapter_commentary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verse_commentary" (
    "id" TEXT NOT NULL,
    "book" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "verse" INTEGER NOT NULL,
    "context" TEXT NOT NULL,
    "strongs" JSONB NOT NULL,
    "words" JSONB NOT NULL,
    "grammar" TEXT,
    "references" TEXT[],
    "commentary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "model" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',

    CONSTRAINT "verse_commentary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chapter_commentary_book_chapter_version_key" ON "chapter_commentary"("book", "chapter", "version");

-- CreateIndex
CREATE UNIQUE INDEX "verse_commentary_book_chapter_verse_version_key" ON "verse_commentary"("book", "chapter", "verse", "version");
