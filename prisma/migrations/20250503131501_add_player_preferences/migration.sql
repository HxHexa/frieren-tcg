-- CreateTable
CREATE TABLE "PlayerPreferences" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "tcgTextSpeed" INTEGER NOT NULL DEFAULT 1500,
    "tcgInviteLength" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "PlayerPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlayerFavouriteCharacters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlayerFavouriteCharacters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerPreferences_playerId_key" ON "PlayerPreferences"("playerId");

-- CreateIndex
CREATE INDEX "_PlayerFavouriteCharacters_B_index" ON "_PlayerFavouriteCharacters"("B");

-- AddForeignKey
ALTER TABLE "PlayerPreferences" ADD CONSTRAINT "PlayerPreferences_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerFavouriteCharacters" ADD CONSTRAINT "_PlayerFavouriteCharacters_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerFavouriteCharacters" ADD CONSTRAINT "_PlayerFavouriteCharacters_B_fkey" FOREIGN KEY ("B") REFERENCES "PlayerPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
