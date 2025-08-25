import { PlayerPreferences, Character } from "@prisma/client";
import prismaClient from "@prismaClient";
import { CharacterData } from "@tcg/characters/characterData/characterData";
import { VISIBLE_CHARACTERS } from "@tcg/characters/characterList";

/**
 * Gets a player's preferences, including their favourite characters.
 * If the player doesn't have a preferences record, it will return null.
 * @param playerId The ID of the player.
 * @returns The PlayerPreferences object with favourite characters, or null.
 */
export async function getPlayerPreferences(playerId: number): Promise<
  | (PlayerPreferences & {
      favouriteCharacters: Character[];
      dislikedCharacters: Character[];
    })
  | null
> {
  try {
    const preferences = await prismaClient.playerPreferences.findUnique({
      where: {
        playerId: playerId,
      },
      include: {
        favouriteCharacters: true,
        dislikedCharacters: true,
      },
    });
    return preferences;
  } catch (error) {
    console.error(`Error fetching preferences for player ${playerId}:`, error);
    throw error;
  }
}

/**
 * Gets a player's preferences, creating a default record if it doesn't exist.
 * Useful when you always expect a preferences record to be available.
 * @param playerId The ID of the player.
 * @returns The PlayerPreferences object with favourite characters.
 */
export async function getOrCreatePlayerPreferences(playerId: number): Promise<
  PlayerPreferences & {
    favouriteCharacters: Character[];
    dislikedCharacters: Character[];
  }
> {
  try {
    const preferences = await prismaClient.playerPreferences.upsert({
      where: {
        playerId: playerId,
      },
      update: {},
      create: {
        playerId: playerId,
      },
      include: {
        favouriteCharacters: true,
        dislikedCharacters: true,
      },
    });
    return preferences;
  } catch (error) {
    console.error(
      `Error getting or creating preferences for player ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Updates the TCG lite mode preference for a player.
 * @param playerId The ID of the player.
 * @param speed The new TCG text speed value.
 * @returns The updated PlayerPreferences object.
 */
export async function updateTcgLiteMode(
  playerId: number,
  enabled: boolean
): Promise<PlayerPreferences> {
  try {
    const preferences = await getOrCreatePlayerPreferences(playerId);
    preferences.tcgLiteMode = enabled;
    await prismaClient.playerPreferences.update({
      where: { id: preferences.id },
      data: { tcgLiteMode: enabled },
    });
    return preferences;
  } catch (error) {
    console.error(
      `Error updating TCG lite mode for player ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Updates the TCG text speed preference for a player.
 * Creates a preferences record if one doesn't exist.
 * @param playerId The ID of the player.
 * @param speed The new TCG text speed value.
 * @returns The updated PlayerPreferences object.
 */
export async function updateTcgTextSpeed(
  playerId: number,
  speed: number
): Promise<PlayerPreferences> {
  try {
    const updatedPreferences = await prismaClient.playerPreferences.upsert({
      where: {
        playerId: playerId,
      },
      update: {
        tcgTextSpeed: speed,
      },
      create: {
        playerId: playerId,
        tcgTextSpeed: speed,
      },
    });
    return updatedPreferences;
  } catch (error) {
    console.error(
      `Error updating TCG text speed for player ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Adds a character to a player's list of favourite characters.
 * Creates a preferences record if one doesn't exist.
 * @param playerId The ID of the player.
 * @param characterId The ID of the character to add as favourite.
 * @returns The updated PlayerPreferences object with the new favourite character included.
 */
export async function addFavouriteCharacter(
  playerId: number,
  characterId: number
): Promise<PlayerPreferences & { favouriteCharacters: Character[] }> {
  try {
    const preferences = await prismaClient.playerPreferences.upsert({
      where: { playerId: playerId },
      update: {},
      create: { playerId: playerId },
    });

    const updatedPreferences = await prismaClient.playerPreferences.update({
      where: { id: preferences.id },
      data: {
        favouriteCharacters: {
          connect: { id: characterId },
        },
      },
      include: {
        favouriteCharacters: true,
      },
    });
    return updatedPreferences;
  } catch (error) {
    console.error(
      `Error adding favourite character ${characterId} for player ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Removes a character from a player's list of favourite characters.
 * @param playerId The ID of the player.
 * @param characterId The ID of the character to remove from favourites.
 * @returns The updated PlayerPreferences object with the character removed.
 */
export async function removeFavouriteCharacter(
  playerId: number,
  characterId: number
): Promise<PlayerPreferences & { favouriteCharacters: Character[] }> {
  try {
    const preferences = await prismaClient.playerPreferences.findUnique({
      where: { playerId: playerId },
    });

    if (!preferences) {
      console.warn(
        `Attempted to remove favourite character for player ${playerId} but no preferences record found.`
      );
      return await prismaClient.playerPreferences.findUniqueOrThrow({
        where: { playerId: playerId },
        include: { favouriteCharacters: true },
      });
    }

    const updatedPreferences = await prismaClient.playerPreferences.update({
      where: { id: preferences.id },
      data: {
        favouriteCharacters: {
          disconnect: { id: characterId },
        },
      },
      include: {
        favouriteCharacters: true,
      },
    });
    return updatedPreferences;
  } catch (error) {
    console.error(
      `Error removing favourite character ${characterId} for player ${playerId}:`,
      error
    );
    throw error;
  }
}

export async function setFavouriteCharacters(
  playerId: number,
  favouriteCharacters: Character[]
) {
  try {
    const updatedPreferences = await prismaClient.playerPreferences.upsert({
      where: { playerId: playerId },
      create: {
        playerId: playerId,
        favouriteCharacters: {
          connect: favouriteCharacters,
        },
      },
      update: {
        favouriteCharacters: {
          set: favouriteCharacters,
        },
      },
      select: {
        favouriteCharacters: true,
      },
    });

    return updatedPreferences;
  } catch (error) {
    console.error(
      `Error setting favourite characters for player ${playerId}:`,
      error
    );
    throw error;
  }
}

export async function getSortedCharactersForPlayer(playerId: number): Promise<{
  favouritedCharacter: CharacterData[];
  nonFavouritedCharacter: CharacterData[];
}> {
  const playerPreferrences = await getPlayerPreferences(playerId);
  if (
    playerPreferrences &&
    playerPreferrences.favouriteCharacters &&
    playerPreferrences.favouriteCharacters.length > 0
  ) {
    const favouritedCharacterNames = new Set(
      playerPreferrences.favouriteCharacters.map((fav) => fav.name)
    );

    const favouritedOnly = [];
    const nonFavouritedOnly = [];

    for (const character of VISIBLE_CHARACTERS) {
      if (favouritedCharacterNames.has(character.characterName)) {
        favouritedOnly.push(character);
      } else {
        nonFavouritedOnly.push(character);
      }
    }

    return {
      favouritedCharacter: favouritedOnly,
      nonFavouritedCharacter: nonFavouritedOnly,
    };
  } else {
    return {
      favouritedCharacter: [],
      nonFavouritedCharacter: VISIBLE_CHARACTERS,
    };
  }
}

export async function setDislikedCharacters(
  playerId: number,
  dislikedCharacters: Character[]
) {
  try {
    const updatedPreferences = await prismaClient.playerPreferences.upsert({
      where: { playerId: playerId },
      create: {
        playerId: playerId,
        dislikedCharacters: {
          connect: dislikedCharacters,
        },
      },
      update: {
        dislikedCharacters: {
          set: dislikedCharacters,
        },
      },
      select: {
        dislikedCharacters: true,
      },
    });

    return updatedPreferences;
  } catch (error) {
    console.error(
      `Error setting disliked characters for player ${playerId}:`,
      error
    );
    throw error;
  }
}

export async function getDislikedCharactersForPlayer(
  discordId: string
): Promise<string[]> {
  try {
    const player = await prismaClient.player.findUnique({
      where: { discordId },
      include: {
        preferences: {
          include: {
            dislikedCharacters: true,
          },
        },
      },
    });

    if (!player?.preferences?.dislikedCharacters) {
      return [];
    }

    return player.preferences.dislikedCharacters.map((char) => char.name);
  } catch (error) {
    console.error(
      `Error getting disliked characters for player ${discordId}:`,
      error
    );
    return [];
  }
}

export async function playerExceedsDislikedLimit(
  discordId: string
): Promise<boolean> {
  try {
    const adminSettings = await prismaClient.adminSettings.findFirst();
    const isEnabled = adminSettings?.dislikedCharactersEnabled ?? true;
    const maxCharacters = adminSettings?.maxDislikedCharacters ?? 3;

    if (!isEnabled || maxCharacters === 0) return false;

    const dislikedCharacters = await getDislikedCharactersForPlayer(discordId);
    return dislikedCharacters.length > maxCharacters;
  } catch (error) {
    console.error("Error checking disliked character limit:", error);
    return false; // default to allowing game
  }
}
