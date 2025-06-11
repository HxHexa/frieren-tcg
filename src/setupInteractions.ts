import { Client, CommandInteraction, MessageFlags, Events } from "discord.js";
import { Command } from "@src/types/command";
import { Middleware, NextMiddleware } from "@src/types/middleware";

import logInteractionMiddleware from "./middlewares/logInteractionMiddleware";
import textSpeedMiddleware from "./middlewares/textSpeedMiddleware";
import liteModeMiddleware from "./middlewares/liteModeMiddleware";

const middlewares: Middleware[] = [
  logInteractionMiddleware,
  textSpeedMiddleware,
  liteModeMiddleware,
];

export const setupInteractions = async (
  client: Client,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands: Record<string, Command<CommandInteraction | any>>
) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    let middlewareIndex = 0;
    const next: NextMiddleware = async () => {
      if (middlewareIndex < middlewares.length) {
        const currentMiddleware = middlewares[middlewareIndex];
        middlewareIndex++;
        await currentMiddleware(interaction, next);
      } else {
        if (interaction.isChatInputCommand()) {
          const command = commands[interaction.commandName];
          if (!command || typeof command.execute !== "function") {
            console.error(
              `Chat command not found or execute function missing: ${interaction.commandName}`
            );
            if (!interaction.replied && !interaction.deferred) {
              await interaction.reply({
                content: "Command not found or improperly configured.",
                flags: MessageFlags.Ephemeral,
              });
            } else {
              await interaction.editReply({
                content: "Command not found or improperly configured.",
                components: [],
              });
            }
            return;
          }
          try {
            await command.execute(interaction);
          } catch (error) {
            console.error(
              `Error executing chat command ${interaction.commandName}:`,
              error
            );
            if (!interaction.replied && !interaction.deferred) {
              await interaction.reply({
                content: "There was an error executing this command.",
                flags: MessageFlags.Ephemeral,
                components: [],
              });
            } else {
              await interaction.editReply(
                "There was an error executing this command."
              );
            }
          }
        } else if (interaction.isAutocomplete()) {
          const command = commands[interaction.commandName];
          if (!command || typeof command.autocomplete !== "function") {
            console.error(
              `Autocomplete requested for command not found or missing execute: ${interaction.commandName}`
            );
            return await interaction.respond([]);
          }
          try {
            await command.autocomplete(interaction);
          } catch (error) {
            console.error(
              `Error handling autocomplete for command ${interaction.commandName}:`,
              error
            );
            await interaction.respond([]);
          }
        }
        // Add other interaction types here if needed (e.g., isButton(), isModalSubmit())
        // else {
        //     // Unhandled interaction type, maybe log or ignore
        //     console.warn(`Unhandled interaction type: ${interaction.type}`);
        // }
      }
    };

    await next();
  });
};
