import {
  ChannelType,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
} from "discord.js";
import type { Command } from "@src/types/command";
import handleAchievementAutocomplete from "./achievementHandler/handleAchievementAutocomplete";
import handleGrantAchievement from "./achievementHandler/handleGrantAchievement";
import { ProgressBarBuilder } from "@tcg/formatting/percentBar";
import config from "@src/config";
import { isTextChannel } from "@sapphire/discord.js-utilities";
import {
  createAchievement,
  deleteAchievement,
} from "./achievementHandler/handleManageAchievement";
import handleLadderReset from "./handleLadderReset/handleLadderReset";
import { removeAllServerRankRoles } from "../tcgChallenge/gameHandler/rankScoresToRankTitleMapping";
import { FRIEREN_DISCORD_SERVER } from "@src/constants";
import prismaClient from "@prismaClient";

const CONFIRM_LADDER_RESET_BUTTON_ID = "ladder-reset-confirm";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-admin")
    .setDescription("Admin commands for TCG game")
    .setContexts([InteractionContextType.Guild])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("debug-progress-bar")
        .setDescription("Debug the progress bar")
        .addIntegerOption((option) =>
          option
            .setName("value")
            .setDescription("Value of the progress bar")
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("length")
            .setDescription("How many emojis long the progress bar is")
            .setMinValue(4)
            .setRequired(false)
        )
        .addIntegerOption((option) =>
          option
            .setName("max_value")
            .setDescription("Max value of the progress bar")
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(false)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("grant-achievement")
        .setDescription("Grant an achievement to a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to grant the achievement to")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("achievement")
            .setDescription("Achievement to grant")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("create-achievement")
        .setDescription("Create an achievement")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name of the achievement")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("Description of the achievement")
            .setRequired(false)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete-achievement")
        .setDescription("Delete an achievement")
        .addStringOption((option) =>
          option
            .setName("achievement")
            .setDescription("Achievement to delete")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("maintenance")
        .setDescription("Manage maintenance mode")
        .addBooleanOption((option) =>
          option
            .setName("maintenance")
            .setDescription("Enable or disable maintenance mode")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .addChannelTypes(ChannelType.GuildText)
            .setDescription(
              "Channel to send maintenance message to (Default: current channel)"
            )
            .setRequired(false)
        )
        .addBooleanOption((option) =>
          option
            .setName("send_message")
            .setDescription(
              "Send a maintenance message to the channel (Default: true)"
            )
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ladder-reset")
        .setDescription("Reset all active ladders for a new season")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disliked-characters")
        .setDescription("Manage disliked characters")
        .addBooleanOption((option) =>
          option
            .setName("enabled")
            .setDescription("Enable or disable disliked characters")
            .setRequired(false)
        )
        .addIntegerOption((option) =>
          option
            .setName("max-characters")
            .setDescription(
              "Maximum number of characters players can dislike (0 = no limits)"
            )
            .setMinValue(0)
            .setMaxValue(10)
            .setRequired(false)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case "create-achievement": {
          const name = interaction.options.getString("name", true);
          const description = interaction.options.getString("description");

          try {
            await interaction.deferReply({
              flags: MessageFlags.Ephemeral,
            });

            const achievement = await createAchievement(name, description);
            await interaction.editReply({
              content: `Achievement created successfully. ID: ${achievement.id}, \`${achievement.name}: ${achievement.description}\``,
            });
          } catch (error) {
            console.error("Error creating achievement:", error);
            await interaction.editReply({
              content: "Failed to create achievement.",
            });
          }
          break;
        }
        case "delete-achievement": {
          const achievementIdString = interaction.options.getString(
            "achievement",
            true
          );
          const achievementId = parseInt(achievementIdString);

          try {
            await interaction.deferReply({
              flags: MessageFlags.Ephemeral,
            });

            await deleteAchievement(achievementId);
            await interaction.editReply({
              content: `Achievement deleted successfully. ID: ${achievementId}`,
            });
          } catch (error) {
            console.error("Error deleting achievement:", error);
            await interaction.editReply({
              content: "Failed to delete achievement.",
            });
          }
          break;
        }
        case "grant-achievement": {
          await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
          });

          try {
            await handleGrantAchievement(interaction);
            await interaction.editReply({
              content: "Achievement granted successfully.",
            });
          } catch (error) {
            console.error("Error granting achievement:", error);
            await interaction.editReply({
              content: "Failed to grant achievement.",
            });
          }

          break;
        }
        case "debug-progress-bar": {
          await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
          });

          const maxValue = interaction.options.getInteger("max_value");
          const value = interaction.options.getInteger("value", true);
          const length = interaction.options.getInteger("length");

          try {
            const progressBar = new ProgressBarBuilder()
              .setValue(value)
              .setMaxValue(maxValue ?? 100)
              .setLength(length ?? 12)
              .build();
            const bar = progressBar.barString;

            await interaction.editReply({
              content: `**Progress Bar:**\n${bar}`,
            });
          } catch (error) {
            console.error("Error in progress bar builder:", error);
            await interaction.editReply({
              content: "Failed to build progress bar.",
            });
          }

          break;
        }
        case "maintenance": {
          handleMaintenance(interaction);
          break;
        }
        case "ladder-reset": {
          await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
          });
          const reply = await interaction.editReply({
            content:
              "Are you sure you want to reset all active ladders and create new ones?",
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId(CONFIRM_LADDER_RESET_BUTTON_ID)
                  .setLabel("Confirm")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
          });
          const collector = reply.createMessageComponentCollector({
            filter: (i) =>
              i.user.id === interaction.user.id &&
              i.customId === CONFIRM_LADDER_RESET_BUTTON_ID,
            max: 1,
            time: 120_000, // 2 minutes
          });
          collector.on("collect", async (i: ButtonInteraction) => {
            try {
              await i.deferReply({ flags: MessageFlags.Ephemeral });
              if (interaction.guildId === FRIEREN_DISCORD_SERVER) {
                await removeAllServerRankRoles(i.client);
              }
              await handleLadderReset(i);
            } catch (error) {
              console.error("Error in ladder reset:", error);
            } finally {
              collector.stop();
            }
          });
          break;
        }
        case "disliked-characters": {
          await handleDislikedCharactersSettings(interaction);
          break;
        }
        default: {
          await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
          });
          await interaction.editReply({
            content: "Invalid subcommand.",
          });
        }
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Interaction failed.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },

  async autocomplete(interaction) {
    try {
      return await handleAchievementAutocomplete(interaction);
    } catch (error) {
      console.error("Error in achievement autocomplete:", error);
      await interaction.respond([]);
    }
  },
};

async function handleMaintenance(interaction: ChatInputCommandInteraction) {
  const sendMessage = interaction.options.getBoolean("send_message") ?? true;
  const channel =
    interaction.options.getChannel<ChannelType.GuildText>("channel") ??
    interaction.channel;

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral,
  });

  const maintenance = interaction.options.getBoolean("maintenance", true);
  try {
    config.maintenance = maintenance;
    await interaction.editReply({
      content: `Maintenance mode is now ${
        maintenance ? "enabled" : "disabled"
      }.`,
    });

    if (sendMessage && isTextChannel(channel)) {
      const message = maintenance
        ? `The game has entered maintenance mode. New challenges will not be accepted. Thank you for your patience.`
        : `The game has exited maintenance mode. New challenges are now accepted.`;

      const maintenanceEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Maintenance Mode")
        .setDescription(message);

      await channel.send({
        embeds: [maintenanceEmbed],
      });
    }
  } catch (error) {
    console.error("Error in maintenance mode:", error);
    await interaction.editReply({
      content: "Failed to set maintenance mode.",
    });
  }
}

async function handleDislikedCharactersSettings(
  interaction: ChatInputCommandInteraction
) {
  const enabled = interaction.options.getBoolean("enabled");
  const maxCharacters = interaction.options.getInteger("max-characters");

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral,
  });

  try {
    let settings = await prismaClient.adminSettings.findFirst();

    if (!settings) {
      settings = await prismaClient.adminSettings.create({
        data: {},
      });
    }

    const updateData: {
      dislikedCharactersEnabled?: boolean;
      maxDislikedCharacters?: number;
    } = {};

    if (enabled !== null) {
      updateData.dislikedCharactersEnabled = enabled;
    }

    if (maxCharacters !== null) {
      updateData.maxDislikedCharacters = maxCharacters;
    }

    if (Object.keys(updateData).length > 0) {
      settings = await prismaClient.adminSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    }

    const statusEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Disliked Characters Settings")
      .addFields(
        {
          name: "Status",
          value: settings.dislikedCharactersEnabled ? "Enabled" : "Disabled",
          inline: true,
        },
        {
          name: "Max Characters",
          value:
            settings.maxDislikedCharacters === 0
              ? "No limit"
              : settings.maxDislikedCharacters.toString(),
          inline: true,
        }
      );

    await interaction.editReply({
      embeds: [statusEmbed],
    });
  } catch (error) {
    console.error("Error:", error);
    await interaction.editReply({
      content: "Failed to update disliked characters settings.",
    });
  }
}
