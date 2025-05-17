import { Client, GatewayIntentBits, Events, Partials } from "discord.js";
import "dotenv/config";
import * as path from "path";
import { loadCommands } from "./loadCommands";
import { registerCommands } from "./registerCommands";
import { setupInteractions } from "./setupInteractions";

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.CLIENT_ID!;
const guildId =
  process.env.NODE_ENV === "production" ? undefined : process.env.GUILD_ID_DEV;

const commandsDir = path.join(__dirname, "commands");

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
  ],
  partials: [Partials.Channel, Partials.Message],
});

async function main() {
  try {
    // Load and register commands
    const commands = await loadCommands(commandsDir);
    await registerCommands(token, clientId, commands, guildId);
    await setupInteractions(client, commands);

    // Log in
    client.on(Events.ClientReady, () => {
      console.log(`Logged in as ${client.user?.tag}!`);

      process.on("unhandledRejection", (reason, p) => {
        console.warn(" [antiCrash] :: Unhandled Rejection/Catch");
        console.error(reason, p);
      });
      process.on("uncaughtException", (err, origin) => {
        console.warn(" [antiCrash] :: Uncaught Exception/Catch");
        console.error(err, origin);
      });
      process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.warn(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
        console.error(err, origin);
      });
    });
    await client.login(token);
  } catch (error) {
    console.error(error);
  }
}

main();
