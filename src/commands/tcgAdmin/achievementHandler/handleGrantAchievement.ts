import { ChatInputCommandInteraction } from "discord.js";
import prismaClient from "@prismaClient";

export default async function handleGrantAchievement(
  interaction: ChatInputCommandInteraction,
) {
  const discordUserId = interaction.options.getUser("user", true).id;
  const achievementId = parseInt(
    interaction.options.getString("achievement", true),
  );

  await prismaClient.$transaction(async (tx) => {
    const achievement = await tx.achievement.findUnique({
      where: {
        id: achievementId,
      },
    });
    if (!achievement) {
      throw new Error("Achievement not found");
    }
    await tx.player.upsert({
      where: {
        discordId: discordUserId,
      },
      create: {
        discordId: discordUserId,
        achievements: {
          connect: {
            id: achievementId,
          },
        },
      },
      update: {
        achievements: {
          connect: {
            id: achievementId,
          },
        },
      },
    });
  });
}
