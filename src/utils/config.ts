import { cleanEnv } from "./cliClient.js";

export interface Config {
  vault?: string;
  obsidianBin?: string;
}

export function loadConfig(): Config {
  return {
    vault: cleanEnv(process.env.OBSIDIAN_VAULT),
    obsidianBin: cleanEnv(process.env.OBSIDIAN_BIN),
  };
}
