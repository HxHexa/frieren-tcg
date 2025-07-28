export enum AuraPlatoon {
  Swordsmen = "Swordsmen",
  Shieldbearers = "Shieldbearers",
  Archers = "Archers",
}

export const auraPlatoonToEmoji: Record<AuraPlatoon, string> = {
  [AuraPlatoon.Swordsmen]: "⚔️",
  [AuraPlatoon.Shieldbearers]: "🛡️",
  [AuraPlatoon.Archers]: "🏹",
};
