import prismaClient from "@prismaClient";

export async function createAchievement(name: string, description: string | null) {
  const achievement = await prismaClient.achievement.create({
    data: {
      name,
      description,
    },
  });

  return achievement;
}

export async function deleteAchievement(achievementId: number) {
  await prismaClient.achievement.delete({
    where: {
      id: achievementId,
    },
  });
}
