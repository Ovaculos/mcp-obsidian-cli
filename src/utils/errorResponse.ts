import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { CliError } from "./cliClient.js";

export function errorResponse(e: unknown): CallToolResult {
  const msg =
    e instanceof CliError ? `CLI error ${e.code}: ${e.message}` : String(e);
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}
