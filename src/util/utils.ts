export const createCountdownTimestamp = (timeLimit: number): string => {
  const timeLimitSeconds = Math.floor(Date.now() / 1000) + timeLimit;
  return `<t:${timeLimitSeconds}:R>`;
};

export const capitalizeFirstLetter = (inp: string): string => {
  return inp.charAt(0).toUpperCase() + inp.slice(1);
};

export const generateCustomRandomString = (
  maxLength: number,
  options: {
    useUppercase?: boolean;
    useLowercase?: boolean;
    useNumbers?: boolean;
    useSpecial?: boolean;
    randomizeLength?: boolean;
    minimumLength?: number;
  } = {}
): string => {
  let chars = "";
  let length = maxLength;
  const minLength = options.minimumLength ?? Math.floor(maxLength / 2);

  if (options.useUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.useLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (options.useNumbers) chars += "0123456789";
  if (options.useSpecial) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Default to alpha if no options selected
  if (chars === "")
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  if (options.randomizeLength) {
    length =
      Math.floor(Math.random() * (maxLength - minLength)) + minLength + 1;
  }

  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

export const getWinrate = (
  wins: number,
  losses: number
): { winrate: number; total: number } => {
  const total = wins + losses;
  return {
    winrate: total === 0 ? 0 : Number(((wins / total) * 100).toFixed(2)),
    total,
  };
};

export const chunkify = <T>(arr: T[], chunkSize: number): T[][] => {
  if (chunkSize <= 0) {
    throw new Error("Chunk size must be a positive integer");
  }
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};
