import { ProgressBarEmoji } from "./emojis";

const filledChar = "█";
const middleChar = "▓";
const emptyChar = "░";

const totalBars = 22;

export default function percentBar(current: number, max: number): string {
  const percent = (current / max) * 100;

  const filledBars = Math.round((percent / 100) * totalBars);
  const emptyBars = totalBars - filledBars;

  let bar = "";

  for (let i = 0; i < filledBars; i++) {
    bar += filledChar;
  }

  if (filledBars < totalBars) {
    bar += middleChar;
  }

  for (let i = 0; i < emptyBars - 1; i++) {
    bar += emptyChar;
  }

  return bar;
}

const defaultEmojis = [
  ProgressBarEmoji.START_EMPTY,
  ProgressBarEmoji.START_HALF,
  ProgressBarEmoji.START_FULL,
  ProgressBarEmoji.MIDDLE_EMPTY,
  ProgressBarEmoji.MIDDLE_HALF,
  ProgressBarEmoji.MIDDLE_FULL,
  ProgressBarEmoji.MIDDLE_COMPLETE,
  ProgressBarEmoji.END_EMPTY,
  ProgressBarEmoji.END_HALF,
  ProgressBarEmoji.END_FULL,
];

export class ProgressBarBuilder {
  private length: number;
  private value: number;
  private maxValue: number;
  private emojis: string[];

  public constructor(options?: ProgressBarBuilderOptions) {
    this.length = options?.length ?? 12;
    this.value = options?.value ?? 0;
    this.maxValue = options?.maxValue ?? 100;
    this.emojis = options?.emojis ?? defaultEmojis;
  }

  public setMaxValue(maxValue: number) {
    this.maxValue = maxValue;
    return this;
  }

  public setValue(value: number) {
    this.value = value;
    return this;
  }

  public setLength(length: number) {
    this.length = length;
    return this;
  }

  /**
   *
   * @param emojis An array of emojis where it starts from the StartEmpty and ends with the EndFull
   * eg: PB1E, PB1H, PB1F, PB2E, PB2H, PB2F, PB2C, PB3E, PB3H, PB3F
   * @default defaultEmojis
   * @returns this
   */
  public loadEmojis(emojis: string[]) {
    this.emojis = emojis;
    return this;
  }

  // returns a ProgressBarBuilderResult object
  public build(): ProgressBarBuilderResult {
    const [
      Bar1empty,
      Bar1mid,
      Bar1full,
      Bar2empty,
      Bar2mid,
      Bar2high,
      Bar2full,
      Bar3empty,
      Bar3mid,
      Bar3full,
    ] = this.emojis;

    if (isNaN(this.value) || isNaN(this.maxValue)) {
      throw new Error("maxValue or value is not a number");
    }

    if (this.length < 3) {
      this.length = 6;
      console.warn("If you set the size to less than 3, it will default to 6.");
    }

    this.length = Math.trunc(this.length);

    const ratio = Math.min(this.value / this.maxValue, 1);
    const exactFill = this.length * ratio;
    const fullSegments = Math.floor(exactFill);
    const decimal = exactFill - fullSegments;
    const barArray: string[] = [];

    // Full segments
    for (let i = 0; i < fullSegments; i++) {
      barArray.push(Bar2full);
    }

    // Partial segment (only one allowed)
    if (decimal >= 0.75) {
      barArray.push(Bar2high);
    } else if (decimal >= 0.25) {
      barArray.push(Bar2mid);
    }

    // Remaining empty segments
    while (barArray.length < this.length) {
      barArray.push(Bar2empty);
    }

    // Replace start cap
    switch (barArray[0]) {
      case Bar2full:
      case Bar2high:
        barArray[0] = Bar1full;
        break;
      case Bar2mid:
        barArray[0] = Bar1mid;
        break;
      default:
        barArray[0] = Bar1empty;
        break;
    }

    // Replace end cap
    const last = barArray.length - 1;
    switch (barArray[last]) {
      case Bar2full:
      case Bar2high:
        barArray[last] = Bar3full;
        break;
      case Bar2mid:
        barArray[last] = Bar3mid;
        break;
      default:
        barArray[last] = Bar3empty;
        break;
    }

    const percent = (ratio * 100).toFixed(1);
    const barStr = barArray.join("");

    return {
      barString: barStr,
      percent: `${barStr} ${percent}%`,
    };
  }
}

type ProgressBarBuilderOptions = {
  length?: number;
  value?: number;
  maxValue?: number;
  emojis?: string[];
};

/**
 * The result of the progress bar builder
 * @interface ProgressBarBuilderResult
 * @property {string} barString - The string representation of the progress bar
 * @property {string} percent - The string representation of the progress bar and the percentage
 */
type ProgressBarBuilderResult = {
  barString: string;
  percent: string;
};
