type Config = {
  debugMode?: boolean;
  maintenance?: boolean;

  logInteractions?: {
    logInteractions: boolean;
    logCommandOptions: boolean;
  };

  logPrismaReqs?: boolean;

  matchfindingPingId: string;
};

const config: Config = {
  debugMode: false,
  maintenance: false,

  logInteractions: {
    logInteractions: true,
    logCommandOptions: true,
  },

  logPrismaReqs: true,

  matchfindingPingId: "1359352321955336336",
} satisfies Config;

export default config;
