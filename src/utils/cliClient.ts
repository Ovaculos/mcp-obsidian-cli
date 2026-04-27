import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const DEFAULT_BIN =
  process.platform === "darwin"
    ? "/Applications/Obsidian.app/Contents/MacOS/obsidian"
    : "obsidian";

export const OBSIDIAN_BIN = process.env.OBSIDIAN_BIN || DEFAULT_BIN;

export class CliError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = "CliError";
  }
}

export async function runObsidian(args: string[]): Promise<string> {
  try {
    const { stdout, stderr } = await execFileAsync(OBSIDIAN_BIN, args, {
      timeout: 30_000,
    });
    if (stderr) console.error("[obsidian-cli]", stderr.trim());
    return stdout.trim();
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException & {
      stderr?: string;
      stdout?: string;
    };
    const msg = err.stderr?.trim() || err.message || "Unknown error";
    throw new CliError(typeof err.code === "number" ? err.code : 1, msg);
  }
}

export function buildArgs(
  command: string,
  opts: Record<string, string | number | boolean | undefined>,
  vaultOverride?: string,
): string[] {
  const vault = vaultOverride || process.env.OBSIDIAN_VAULT;
  const args = [command];
  if (vault) args.push(`vault=${vault}`);
  for (const [key, value] of Object.entries(opts)) {
    if (value === undefined) continue;
    if (typeof value === "boolean") {
      if (value) args.push(key);
    } else {
      args.push(`${key}=${String(value)}`);
    }
  }
  return args;
}
