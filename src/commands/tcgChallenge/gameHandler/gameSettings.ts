export enum GameMode {
  CLASSIC = "classic",
  CLASSIC_PRESCIENCE = "classic-prescience",
  BLITZ = "blitz",
  SLOW = "slow",
}

export interface GameSettings {
  turnDurationSeconds: number;
  revealHand: boolean;
  revealDraw: boolean;
  prescienceMode: boolean;
  publicChallengedThread?: boolean;
  optionName?: string;
  allowedOption?: boolean;
  goddessMode?: boolean;
  liteMode?: boolean | undefined;
}

export const GAME_SETTINGS: Record<GameMode, GameSettings> = {
  [GameMode.CLASSIC]: {
    turnDurationSeconds: 45,
    revealHand: false,
    revealDraw: false,
    optionName: "Classic - 45s Turn Duration",
    allowedOption: true,
    prescienceMode: false,
  },
  [GameMode.CLASSIC_PRESCIENCE]: {
    turnDurationSeconds: 45,
    revealHand: false,
    revealDraw: false,
    optionName: "Classic Prescience - 45s Turn Duration. Prescience Mode.",
    allowedOption: true,
    prescienceMode: true,
  },
  [GameMode.BLITZ]: {
    turnDurationSeconds: 10,
    revealHand: false,
    revealDraw: false,
    optionName: "Blitz - 10s Turn Duration",
    allowedOption: true,
    prescienceMode: false,
  },
  [GameMode.SLOW]: {
    turnDurationSeconds: 120,
    revealHand: true,
    revealDraw: true,
    optionName: "Slow - 2m Turn Duration. Hands and Active Cards revealed",
    allowedOption: true,
    prescienceMode: false,
  },
};
