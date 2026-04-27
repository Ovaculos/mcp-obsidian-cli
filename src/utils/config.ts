export interface Config {
  vault?: string;
  obsidianBin?: string;
}

export function loadConfig(): Config {
  return {
    vault: process.env.OBSIDIAN_VAULT || undefined,
    obsidianBin: process.env.OBSIDIAN_BIN || undefined,
  };
}
