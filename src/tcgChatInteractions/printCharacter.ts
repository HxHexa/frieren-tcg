import { formatAbility } from "@src/tcg/ability";
import Character from "@tcg/character";
import { statDetails } from "@tcg/formatting/emojis";
import { ProgressBarBuilder } from "@tcg/formatting/percentBar";
import { StatsEnum } from "@tcg/stats";

export const printCharacter = (
  character: Character,
  obfuscateInformation: boolean
): string => {
  const meta = character.additionalMetadata;

  const printStack: string[] = [];
  const charStat = character.stats.stats;
  let hpInfo: string;
  if (obfuscateInformation && (meta.manaSuppressed || meta.deceitful)) {
    if (meta.deceitful) {
      hpInfo = "10 / 10";
    } else {
      hpInfo = "?? / ??";
    }
  } else {
    const healthbar = new ProgressBarBuilder()
      .setValue(charStat.HP)
      .setMaxValue(character.initialStats.stats.HP)
      .setLength(10)
      .build();
    hpInfo = `${charStat.HP}/${character.initialStats.stats.HP} ${healthbar.barString}`;
  }
  const activePileCount = character.deck.activePile.length;
  const discardPileCount = character.deck.discardPile.length;
  const lines = [
    `# ${character.name} (${character.characterUser.displayName}) [⠀](${character.cosmetic.imageUrl})`,
    `- ${statDetails[StatsEnum.HP].emoji} **HP**: ${hpInfo}`,
    `- ${statDetails[StatsEnum.ATK].emoji} **ATK**: ${meta.deceitful && obfuscateInformation ? 1 : charStat.ATK}`,
    `- ${statDetails[StatsEnum.DEF].emoji} **DEF**: ${meta.deceitful && obfuscateInformation ? 1 : charStat.DEF}`,
    `- ${statDetails[StatsEnum.TrueDEF].emoji} **TrueDEF**: ${meta.deceitful && obfuscateInformation ? 0 : charStat.TrueDEF}`,
    `- ${statDetails[StatsEnum.SPD].emoji} **SPD**: ${meta.deceitful && obfuscateInformation ? 1 : charStat.SPD}`,
    `- ${statDetails[StatsEnum.Ability].emoji} **Ability**: ${character.ability.abilityName} - ${charStat.Ability}`,
    `  - ${formatAbility(character.ability)}`,
    `**Active Pile:** ${activePileCount} Card${activePileCount > 1 ? "s" : ""}     **Discard Pile:** ${discardPileCount} Card${discardPileCount > 1 ? "s" : ""}`,
  ];
  printStack.push(lines.join("\n"));

  const statuses: string[] = [];
  const [sleepyCount, mesmerizedCount, weakenedCount] = character.hand.reduce(
    (acc, card) => {
      if (card.title === "Sleepy") acc[0]++;
      else if (card.title === "Mesmerized") acc[1]++;
      else if (card.title === "Weakened") acc[2]++;
      return acc;
    },
    [0, 0, 0]
  );
  if (sleepyCount > 0) {
    statuses.push(`**Sleepy**: ${sleepyCount}`);
  }
  if (mesmerizedCount > 0) {
    statuses.push(`**Mesmerized**: ${mesmerizedCount}`);
  }
  if (weakenedCount > 0) {
    statuses.push(`**Weakened**: ${weakenedCount}`);
  }
  if (statuses.length > 0) {
    printStack.push(statuses.join(", "));
  }

  if (meta.manaSuppressed) {
    printStack.push(
      `**Mana Suppression**: ${character.name} suppresses ${character.cosmetic.pronouns.possessive} mana - ${character.cosmetic.pronouns.possessive} HP is hidden.`
    );
  }
  if (meta.senseTeaTimeStacks) {
    printStack.push(`**Tea Time Snacks**: ${meta.senseTeaTimeStacks}`);
  }
  if (meta.fernBarrage && meta.fernBarrage > 0) {
    printStack.push(`**Barrage**: ${meta.fernBarrage}`);
  }
  if (meta.forcedDiscards > 0) {
    printStack.push(`**Forced Discards**: ${meta.forcedDiscards}`);
  }
  if (character.timedEffects.length > 0) {
    printStack.push(`**Timed effects:**`);
    character.timedEffects.forEach((effect) => {
      printStack.push(effect.printEffect());
    });
  }
  return printStack.join("\n");
};
