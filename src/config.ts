type Config = {
  debugMode?: boolean;
  maintenance?: boolean;

  logInteractions?: {
    logInteractions: boolean;
    logCommandOptions: boolean;
  };

  logPrismaReqs?: boolean;

  matchfindingPingId: string;

  teamVote: {
    challengerChannel: string;
    opponentChannel: string;
  };
};

const env_dev = process.env.NODE_ENV === "development";

const config: Config = {
  debugMode: false,
  maintenance: false,

  logInteractions: {
    logInteractions: true,
    logCommandOptions: true,
  },

  logPrismaReqs: true,

  matchfindingPingId: "1359352321955336336",

  teamVote: {
    challengerChannel: env_dev ? "1344400530314629170" : "1482775131859452046",
    opponentChannel: env_dev ? "1344400506658881566" : "1482775274499346522",
  },
};

export default config;
