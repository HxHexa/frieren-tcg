import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  ComponentType,
  MessageFlags,
} from "discord.js";
import { sendInfoMessage } from "./util/sendInfoMessage";
import { statDetails } from "@tcg/formatting/emojis";
import { createCharacterDropdown } from "@src/util/createCharacterDropdown";
import Card from "@tcg/card";
import { handleCharacterSelection } from "@src/tcgChatInteractions/handleCharacterSelection";
import { getPlayer } from "@src/util/db/getPlayer";
import { getPlayerPreferences } from "@src/util/db/preferences";
import { formatAbility } from "@src/tcg/ability";
import { CharacterName } from "@src/tcg/characters/metadata/CharacterName";
import { edelStatusCards } from "@src/tcg/decks/utilDecks/edelStatuses";

export async function showCharacterInfo(
  interaction: ChatInputCommandInteraction
) {
  try {
    const customCharacterInfoId = `character-info-${interaction.user.id}-${Date.now()}`;
    const characterDropdown = await createCharacterDropdown(
      interaction.user,
      customCharacterInfoId
    );

    // Send initial message with the menu
    const response = await sendInfoMessage(
      interaction,
      characterDropdown.embed,
      [characterDropdown.dropdown]
    );

    // Create a collector for the dropdown menu
    if (response) {
      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.customId === customCharacterInfoId,
        time: 300_000, // 5 minutes
      });

      collector.on("collect", async (i: StringSelectMenuInteraction) => {
        try {
          // Verify that the interaction is from the original user
          if (i.user.id !== interaction.user.id) {
            await i.reply({
              content: "Invalid user.",
              flags: MessageFlags.Ephemeral,
            });
            return;
          }

          const player = await getPlayer(i.user.id);
          const preferences = await getPlayerPreferences(player.id);

          const { selectedCharacter: char } = await handleCharacterSelection(
            i,
            preferences,
            characterDropdown.characterListUsed
          );

          // Create new embed for the selected character
          const deckSize = char.cards.reduce(
            (sum, { count }) => sum + count,
            0
          );
          const characterEmbed = new EmbedBuilder()
            .setColor(char.cosmetic.color)
            .setTitle(`${char.cosmetic.emoji} ${char.characterName}`)
            .setTimestamp()
            .setThumbnail(char.cosmetic.imageUrl)
            .addFields(
              {
                name: "Stats",
                value: [
                  `- ${statDetails.HP.emoji} **HP**: ${char.stats.stats.HP}`,
                  `- ${statDetails.ATK.emoji} **ATK**: ${char.stats.stats.ATK}`,
                  `- ${statDetails.DEF.emoji} **DEF**: ${char.stats.stats.DEF}`,
                  `- ${statDetails.SPD.emoji} **SPD**: ${char.stats.stats.SPD}`,
                ].join("\n"),
              },
              {
                name: `Ability: ${char.ability.abilityName}`,
                value: formatAbility(char.ability),
              },
              {
                name: `Deck: ${deckSize} Cards`,
                value: "",
              }
            )
            .addFields(
              char.cards.map((cardCount: { card: Card; count: number }) => {
                const card = cardCount.card;
                const count = cardCount.count;
                return {
                  name:
                    `${card.emoji} **${card.title}** ` +
                    `${card.cardMetadata.signature ? "(signature) " : " "}` +
                    `x ${count}:`,
                  value: `${card.getDescription()}`,
                };
              })
            );

          if (char.characterName === CharacterName.Edel) {
            characterEmbed
              .addFields({
                name: "Edel's Status Cards",
                value: "",
              })
              .addFields(
                edelStatusCards.map((card: Card) => {
                  return {
                    name: `${card.emoji} **${card.title}** `,
                    value: `${card.getDescription()}`,
                  };
                })
              );
          }

          await i.update({
            embeds: [characterEmbed],
            components: [characterDropdown.dropdown], // Keep the dropdown menu
          });
        } catch (error) {
          console.error(error);
          await i.reply({
            content: "There was an error while fetching character information.",
            flags: MessageFlags.Ephemeral,
          });
        }
      });

      collector.on("end", async () => {
        // When the collector expires, disable the select menu
        characterDropdown.selectMenu.setDisabled(true);
        const disabledRow =
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            characterDropdown.selectMenu
          );

        await interaction
          .editReply({
            components: [disabledRow],
          })
          .catch(() => {
            // Ignore any errors if the message was deleted
          });
      });
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({
        content: "There was an error while fetching character information.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
