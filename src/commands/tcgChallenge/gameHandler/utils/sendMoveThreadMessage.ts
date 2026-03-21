import { buildThreadLink } from "@src/util/formatting/links";

import {
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ButtonBuilder,
  ButtonStyle,
  User,
  MessageFlags,
  GuildTextBasedChannel,
} from "discord.js";

const sendMoveThreadMessage = (
  channel: GuildTextBasedChannel,
  user: User,
  selectionThread: GuildTextBasedChannel
) => {
  channel.send({
    components: [
      new ContainerBuilder().addSectionComponents(
        new SectionBuilder()
          .setButtonAccessory(
            new ButtonBuilder()
              .setLabel("Go to Thread")
              .setStyle(ButtonStyle.Link)
              .setURL(buildThreadLink(selectionThread.id))
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `${user}, choose your character!`
            )
          )
      ),
    ],
    flags: MessageFlags.IsComponentsV2,
  });
};

export default sendMoveThreadMessage;
