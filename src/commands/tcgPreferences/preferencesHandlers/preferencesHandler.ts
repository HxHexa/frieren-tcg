import {
  CHARACTER_MAP,
  VISIBLE_CHARACTERS,
} from "@tcg/characters/characterList";
import type { CharacterName } from "@tcg/characters/metadata/CharacterName";
import {
  getOrCreatePlayerPreferences,
  getPlayerPreferences,
  setFavouriteCharacters,
  updateTcgLiteMode,
  updateTcgTextSpeed,
} from "@src/util/db/preferences";
import {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  type ChatInputCommandInteraction,
  type SelectMenuComponentOptionData,
  type StringSelectMenuInteraction,
} from "discord.js";
import { getPlayer } from "@src/util/db/getPlayer";
import { charWithEmoji } from "@tcg/formatting/emojis";
import prismaClient from "@prismaClient";

export async function handlePlayerPreferences(
  interaction: ChatInputCommandInteraction
) {
  const preferenceAction = interaction.options.getSubcommand();
  const player = await getPlayer(interaction.user.id);

  const playerId = player.id;

  try {
    switch (preferenceAction) {
      case "view": {
        const preferences = await getOrCreatePlayerPreferences(playerId);
        const favouriteCharacterData = preferences.favouriteCharacters.map(
          (char) => CHARACTER_MAP[char.name as CharacterName]
        );
        let response = "";
        response += `Text Speed: \`${preferences.tcgTextSpeed} ms\`\n`;
        response += `Lite Mode: \`${preferences.tcgLiteMode ? "Enabled" : "Disabled"}\`\n`;

        if (preferences.favouriteCharacters.length > 0) {
          response += `Favourite Characters: ${favouriteCharacterData.map((char) => `${char.cosmetic.emoji} ${char.characterName}`).join(", ")}\n`;
        } else {
          response += `Favourite Characters: None\n`;
        }

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blurple")
              .setTitle("Player Preferences")
              .setDescription(response),
          ],
        });
        break;
      }

      case "set-text-speed": {
        const speed = interaction.options.getInteger("speed", true);
        await updateTcgTextSpeed(playerId, speed);
        await interaction.editReply({
          content: `Your TCG text speed preference has been set to \`${speed} ms\`.`,
        });
        break;
      }

      case "lite-mode": {
        const enabled = interaction.options.getBoolean("enabled", true);
        await updateTcgLiteMode(playerId, enabled);
        await interaction.editReply({
          content: `Your TCG lite mode preference has been set to \`${enabled}\`.`,
        });
        break;
      }

      case "favourite-character": {
        const preferences = await getPlayerPreferences(playerId);
        const options: SelectMenuComponentOptionData[] = VISIBLE_CHARACTERS.map(
          (char) => {
            return {
              label: char.characterName,
              value: char.characterName,
              emoji: char.cosmetic.emoji,
              default: preferences?.favouriteCharacters.some(
                (fav) => fav.name === char.characterName
              ),
            };
          }
        );

        const CUSTOM_ID = "favourite-character-select";
        const favouriteCharactersSelectMenu = new StringSelectMenuBuilder()
          .setCustomId(CUSTOM_ID)
          .setPlaceholder("Select a character")
          .setMaxValues(VISIBLE_CHARACTERS.length)
          .setMinValues(0)
          .setOptions(options);

        const embed = new EmbedBuilder()
          .setColor("Blurple")
          .setTitle("Favourite Characters")
          .setDescription(`Select a character to add to your favourites.`)
          .addFields({
            name: "Favourite Characters",
            value:
              preferences?.favouriteCharacters
                .map((char) => charWithEmoji(char.name as CharacterName))
                .join(", ") || "None",
          });

        const actionRow =
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            favouriteCharactersSelectMenu
          );

        const reply = await interaction.editReply({
          embeds: [embed],
          components: [actionRow],
        });

        const collector = reply.createMessageComponentCollector({
          time: 60_000, // 1 minute
        });
        collector.on("collect", async (i: StringSelectMenuInteraction) => {
          try {
            await i.deferUpdate();
            const newFavouriteCharacterNames = i.values;

            const dbCharacters = await prismaClient.character.findMany({
              where: {
                name: { in: newFavouriteCharacterNames },
              },
            });

            const validDbCharacters = dbCharacters.filter(
              (dbChar) => dbChar !== null
            );

            await setFavouriteCharacters(playerId, validDbCharacters);

            const updatedEmbed = new EmbedBuilder(embed.data).setFields({
              name: "Favourite Characters",
              value:
                newFavouriteCharacterNames
                  .map((name) => charWithEmoji(name as CharacterName))
                  .join(", ") || "None",
            });

            i.editReply({
              embeds: [updatedEmbed],
              components: [],
            });
          } catch (error) {
            console.error("Error in favourite character select menu:", error);
          }
        });

        break;
      }

      default:
        await interaction.editReply({
          content: "Invalid preferences subcommand.",
        });
    }
  } catch (error) {
    console.error("Error handling player preferences:", error);
    await interaction.editReply({
      content: "An error occurred while managing your preferences.",
    });
  }
}
