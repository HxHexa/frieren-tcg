import { GameMode } from "@src/commands/tcgChallenge/gameHandler/gameSettings";
import prismaClient from "./client";
import { CHARACTER_LIST } from "@tcg/characters/characterList";

async function main() {
  await prismaClient.$transaction(async (tx) => {
    // Upsert characters
    await Promise.all(
      CHARACTER_LIST.map((character) =>
        tx.character.upsert({
          where: { name: character.characterName },
          update: {},
          create: { name: character.characterName },
        })
      )
    );

    // Upsert ladders
    const createdLadders = await Promise.all(
      Object.values(GameMode).map((name) =>
        tx.ladder.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );

    // Create ladder resets for new ladders only
    const resetPromises = createdLadders.map(async (ladder) => {
      const existingReset = await tx.ladderReset.findFirst({
        where: { ladderId: ladder.id, endDate: null },
      });

      if (!existingReset) {
        return tx.ladderReset.create({
          data: {
            ladderId: ladder.id,
          },
        });
      }
    });

    await Promise.all(resetPromises);
  });
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
