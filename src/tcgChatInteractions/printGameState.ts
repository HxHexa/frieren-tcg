import Character from "@tcg/character";
import Game from "@tcg/game";
import { MessageCache } from "./messageCache";
import { printCharacter } from "./printCharacter";
import { TCGThread } from "./sendGameMessage";
import { FlammeTheory } from "@tcg/additionalMetadata/gameAdditionalMetadata";

// only print game state. do not update state
export const printGameState = (
  game: Game,
  messageCache: MessageCache,
  obfuscateInformation: boolean = true
) => {
  game.characters.forEach((character: Character) => {
    messageCache.push(
      printCharacter(game, character, obfuscateInformation),
      TCGThread.Gameroom
    );
    if (character.skipTurn) {
      messageCache.push(
        `## ${character.name} skips this turn!`,
        TCGThread.Gameroom
      );
    }
  });

  const theoryText = printTheory(game.additionalMetadata.flammeTheory);
  if (theoryText) {
    messageCache.push(theoryText, TCGThread.Gameroom);
  }
};

export const printTheory = (
  flammeTheories: Record<FlammeTheory, boolean>
): string | undefined => {
  const flammeDiscoveredTheories = Object.entries(flammeTheories)
    .filter(([, isDiscovered]) => isDiscovered)
    .map(([theory]) => `**${theory}**`)
    .join(", ");

  return flammeDiscoveredTheories
    ? `### Flamme's Discovered Theories:\n${flammeDiscoveredTheories}`
    : "";
};
