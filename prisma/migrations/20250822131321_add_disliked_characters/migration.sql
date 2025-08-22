-- CreateTable
CREATE TABLE "AdminSettings" (
    "id" SERIAL NOT NULL,
    "dislikedCharactersEnabled" BOOLEAN NOT NULL DEFAULT true,
    "maxDislikedCharacters" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "AdminSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlayerDislikedCharacters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlayerDislikedCharacters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlayerDislikedCharacters_B_index" ON "_PlayerDislikedCharacters"("B");

-- AddForeignKey
ALTER TABLE "_PlayerDislikedCharacters" ADD CONSTRAINT "_PlayerDislikedCharacters_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerDislikedCharacters" ADD CONSTRAINT "_PlayerDislikedCharacters_B_fkey" FOREIGN KEY ("B") REFERENCES "PlayerPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
