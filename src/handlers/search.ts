import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import { buildArgs, runObsidian } from "../utils/cliClient.js";
import { errorResponse } from "../utils/errorResponse.js";
import type {
  SearchContextSchema,
  SearchVaultSchema,
} from "../utils/schemas.js";

const ok = (text: string): CallToolResult => ({
  content: [{ type: "text", text }],
});

export async function searchVault(
  args: z.infer<typeof SearchVaultSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "search",
          {
            query: args.query,
            path: args.path,
            limit: args.limit,
            case: args.case_sensitive,
            format: "json",
          },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function searchContext(
  args: z.infer<typeof SearchContextSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "search:context",
          {
            query: args.query,
            path: args.path,
            limit: args.limit,
            case: args.case_sensitive,
            format: "json",
          },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}
