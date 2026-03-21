import { createCountdownTimestamp } from "@src/util/utils";
import { VISIBLE_CHARACTERS } from "@tcg/characters/characterList";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { charWithEmoji } from "@tcg/formatting/emojis";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  GuildTextBasedChannel,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  User,
} from "discord.js";

const BAN_TIME_LIMIT_SECONDS = 60;

export const getPlayerBans = async (
  player: User,
  playerThread: GuildTextBasedChannel,
  banCount: number
): Promise<CharacterName[]> => {
  if (banCount <= 0) {
    return [];
  }

  const availableCharacters = VISIBLE_CHARACTERS;
  if (availableCharacters.length === 0) {
    return [];
  }

  const countdown = createCountdownTimestamp(BAN_TIME_LIMIT_SECONDS);
  const customId = `ban-select-${player.id}-${Date.now()}`;

  const selectionLabel =
    banCount === 1 ? "1 character" : `${banCount} characters`;
  const maxValues = Math.min(Math.max(banCount, 0), availableCharacters.length);

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(`Select up to ${selectionLabel} to ban`)
    .setMinValues(0)
    .setMaxValues(maxValues)
    .addOptions(
      availableCharacters.map((char) => ({
        label: char.characterName,
        value: char.characterName,
        emoji: char.cosmetic.emoji,
      }))
    );

  const embed = new EmbedBuilder()
    .setColor(0xc5c3cc)
    .setTitle("Frieren TCG - Ban Phase")
    .setDescription(
      `${countdown} to choose up to ${selectionLabel} to ban. Use the Skip button if you want to ban none.`
    )
    .addFields({
      name: "Bans In This Match",
      value: availableCharacters
        .map((char) => `${char.cosmetic.emoji} ${char.characterName}`)
        .join("\n"),
    });

  const selectRow =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
  const skipButtonId = `ban-skip-${player.id}-${Date.now()}`;
  const skipRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(skipButtonId)
      .setLabel("Skip")
      .setStyle(ButtonStyle.Secondary)
  );

  const response = await playerThread.send({
    embeds: [embed],
    components: [selectRow, skipRow],
  });

  return new Promise<CharacterName[]>((resolve) => {
    let isResolved = false;

    const selectCollector = response.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: BAN_TIME_LIMIT_SECONDS * 1000,
    });

    const skipCollector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: BAN_TIME_LIMIT_SECONDS * 1000,
      filter: (interaction) => interaction.customId === skipButtonId,
    });

    const finalize = (result: CharacterName[]) => {
      if (!isResolved) {
        isResolved = true;
        resolve(result);
      }
    };

    let collectorsStopped = false;
    const clearCollectors = (reason: string) => {
      if (collectorsStopped) {
        return;
      }
      collectorsStopped = true;
      if (!selectCollector.ended) {
        selectCollector.stop(reason);
      }
      if (!skipCollector.ended) {
        skipCollector.stop(reason);
      }
    };

    const sendTimeoutMessage = async () => {
      try {
        await response.edit({
          embeds: [
            EmbedBuilder.from(embed).setFooter({
              text: "Ban selection timed out. No bans were recorded.",
            }),
          ],
          components: [],
        });
      } catch (error) {
        console.error("Error editing ban timeout message:", error);
      }
    };

    const fallbackTimeout = setTimeout(
      () => {
        if (!isResolved) {
          void sendTimeoutMessage();
          clearCollectors("fallback");
          finalize([]);
        }
      },
      (BAN_TIME_LIMIT_SECONDS + 5) * 1000
    );

    selectCollector.on(
      "collect",
      async (interaction: StringSelectMenuInteraction) => {
        try {
          if (interaction.user.id !== player.id) {
            await interaction.reply({
              content: "You are not part of this ban selection.",
              flags: MessageFlags.Ephemeral,
            });
            return;
          }

          const selectedNames = Array.from(
            new Set(interaction.values.map((value) => value as CharacterName))
          );

          const description =
            selectedNames.length === 0
              ? "You skipped banning any characters."
              : `You banned ${
                  selectedNames.length === 1
                    ? "the following character"
                    : "the following characters"
                }:
${selectedNames.map((name) => `- ${charWithEmoji(name)}`).join("\n")}`;

          await interaction.update({
            embeds: [EmbedBuilder.from(embed).setDescription(description)],
            components: [],
          });

          clearTimeout(fallbackTimeout);
          clearCollectors("selection");
          finalize(selectedNames);
        } catch (error) {
          console.error("Error collecting bans:", error);
          try {
            if (!interaction.replied && !interaction.deferred) {
              await interaction.reply({
                content: "Failed to record your bans. Please try again.",
                flags: MessageFlags.Ephemeral,
              });
            }
          } finally {
            clearTimeout(fallbackTimeout);
            clearCollectors("error");
            finalize([]);
          }
        }
      }
    );

    skipCollector.on("collect", async (interaction: ButtonInteraction) => {
      try {
        if (interaction.user.id !== player.id) {
          await interaction.reply({
            content: "You are not part of this ban selection.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        await interaction.update({
          embeds: [
            EmbedBuilder.from(embed).setDescription(
              "You skipped banning any characters."
            ),
          ],
          components: [],
        });
      } catch (error) {
        console.error("Error handling skip:", error);
      } finally {
        clearTimeout(fallbackTimeout);
        clearCollectors("skip");
        finalize([]);
      }
    });

    const handleCollectorEnd = async (reason: string) => {
      if (reason === "time" && !isResolved) {
        clearTimeout(fallbackTimeout);
        await sendTimeoutMessage();
        finalize([]);
      }
    };

    selectCollector.on("end", (_, reason) => {
      void handleCollectorEnd(reason);
    });

    skipCollector.on("end", (_, reason) => {
      void handleCollectorEnd(reason);
    });
  });
};
