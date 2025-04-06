import { Client, CommandInteraction, MessageFlags } from "discord.js";
import { Command } from "./types/command";
import { Interaction } from "discord.js";
export const setupInteractions = async (
  client: Client,
  commands: Record<string, Command<CommandInteraction>>,
) => {
  // Set up command handling
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = commands[interaction.commandName];
      if (!command) {
        console.error(
          `Command not found: ${interaction.commandName}\nInteraction: ${interaction}`,
        );
        interaction.reply({
          content: "Command not found.",
          flags: MessageFlags.Ephemeral,
        });
      }
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error executing this command",
          flags: MessageFlags.Ephemeral,
        });
      }
    } else if (interaction.isAutocomplete()) {
      const command = commands[interaction.commandName];
      if (!command || !command.autocomplete) {
        console.error(
          `Command not found or autocomplete not defined: ${interaction.commandName}\nInteraction: ${interaction}`,
        );
        return await interaction.respond([]);
      }

      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
        await interaction.respond([]);
      }
    } else {
      return;
    }
  });
};
