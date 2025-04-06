import { PrismaClient } from "@prisma/client";
import matchExt from "./extensions/match";
import masteryExt from "./extensions/characterMastery";
import logReqsExt from "./extensions/logReqs";
import config from "@src/config";

const prismaClient = new PrismaClient().$extends({
  ...matchExt,
  ...masteryExt,
  ...(config.logPrismaReqs ? logReqsExt : {}),
});

// these extensions may or may not be used, they're just examples

export default prismaClient;
