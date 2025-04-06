import {
  ActionRowBuilder,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
} from "discord.js";

export const sendInfoMessage = async (
  interaction: ChatInputCommandInteraction,
  embed: EmbedBuilder,
  components?: ActionRowBuilder<StringSelectMenuBuilder>[],
  dm?: boolean
) => {
  if (interaction.channel?.type === ChannelType.DM || dm) {
    await interaction.reply({
      content: `Sending DM...`,
      flags: MessageFlags.Ephemeral,
    });
    if (!interaction.user.dmChannel) {
      return await interaction.editReply({
        content: `You have DMs disabled`,
      });
    }
    return await interaction.user
      .send({ embeds: [embed], components: components })
      .catch(async (error) => {
        console.log(error);
        await interaction.editReply({
          content: `Failed to send DM.`,
        });
      });
  } else {
    return await interaction.reply({
      embeds: [embed],
      components: components,
      flags: MessageFlags.Ephemeral,
    });
  }
};
