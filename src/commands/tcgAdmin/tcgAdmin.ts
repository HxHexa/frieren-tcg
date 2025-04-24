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
import type { Command } from "../../types/command";
import handleAchievementAutocomplete from "./achievementHandler/handleAchievementAutocomplete";
import handleGrantAchievement from "./achievementHandler/handleGrantAchievement";
import { ProgressBarBuilder } from "@src/tcg/formatting/percentBar";
import config from "@src/config";
import { isTextChannel } from "@sapphire/discord.js-utilities";
import {
  createAchievement,
  deleteAchievement,
} from "./achievementHandler/handleManageAchievement";
import handleLadderReset from "./handleLadderReset/handleLadderReset";

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
          const collector = reply
            .createMessageComponentCollector({
              filter: (i) =>
                i.user.id === interaction.user.id &&
                i.customId === CONFIRM_LADDER_RESET_BUTTON_ID,
              max: 1,
              time: 120_000,
            })
            collector.on("collect", async (i: ButtonInteraction) => {
              try {
                await handleLadderReset(i);
              } catch (error) {
                console.error("Error in ladder reset:", error);
              } finally {
				collector.stop();
              }
            });
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
