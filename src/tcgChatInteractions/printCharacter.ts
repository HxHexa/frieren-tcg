import Character from "../tcg/character";
import { statDetails } from "../tcg/formatting/emojis";
import percentBar, { ProgressBarBuilder } from "../tcg/formatting/percentBar";
import { StatsEnum } from "../tcg/stats";

export const printCharacter = (
  character: Character,
  obfuscateInformation: boolean,
): string => {
  const printStack: String[] = [];
  const charStat = character.stats.stats;
  let hpInfo: string;
  if (character.additionalMetadata.manaSuppressed && obfuscateInformation) {
    hpInfo = "?? / ??";
  } else {
    const healthbar = new ProgressBarBuilder()
      .setValue(charStat.HP)
      .setMaxValue(character.initialStats.stats.HP)
      .setLength(10)
      .build();
    hpInfo = `${charStat.HP}/${character.initialStats.stats.HP} ${healthbar.barString}`;
  }
  const lines = [
    `# ${character.name} (${character.characterUser.username}) [⠀](${character.cosmetic.imageUrl})`,
    `- ${statDetails[StatsEnum.HP].emoji} **HP**: ${hpInfo}`,
    `- ${statDetails[StatsEnum.ATK].emoji} **ATK**: ${charStat.ATK}`,
    `- ${statDetails[StatsEnum.DEF].emoji} **DEF**: ${charStat.DEF}`,
    `- ${statDetails[StatsEnum.SPD].emoji} **SPD**: ${charStat.SPD}`,
    `- ${statDetails[StatsEnum.Ability].emoji} **Ability**: ${character.ability.abilityName} - ${charStat.Ability}`,
    `  - ${character.ability.abilityEffectString}`,
  ];
  printStack.push(lines.join("\n"));
  if (character.additionalMetadata.manaSuppressed) {
    printStack.push(
      `**Mana Suppression**: ${character.name} suppresses ${character.cosmetic.pronouns.possessive} mana - ${character.cosmetic.pronouns.possessive} HP is hidden.`,
    );
  }
  if (character.additionalMetadata.teaTimeStacks) {
    printStack.push(
      `**Tea Time Snacks**: ${character.additionalMetadata.teaTimeStacks}`,
    );
  }
  if (character.timedEffects.length > 0) {
    printStack.push(`**Timed effects:**`);
    character.timedEffects.forEach((effect) => {
      printStack.push(effect.printEffect());
    });
  }
  return printStack.join("\n");
};
