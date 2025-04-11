import { Prisma } from "@prisma/client";

const masteryExt = Prisma.defineExtension({
  result: {
    characterMastery: {
      totalMatches: {
        needs: {
          losses: true,
          wins: true,
        },
        compute({ losses, wins }): number {
          return losses + wins;
        },
      },
    },
  },
});

export default masteryExt;
