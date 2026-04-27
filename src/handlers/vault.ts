import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import { buildArgs, runObsidian } from "../utils/cliClient.js";
import { errorResponse } from "../utils/errorResponse.js";
import type { ListFoldersSchema, VaultInfoSchema } from "../utils/schemas.js";

const ok = (text: string): CallToolResult => ({
  content: [{ type: "text", text }],
});

export async function vaultInfo(
  args: z.infer<typeof VaultInfoSchema>,
): Promise<CallToolResult> {
  try {
    return ok(await runObsidian(buildArgs("vault", {}, args.vault)));
  } catch (e) {
    return errorResponse(e);
  }
}

export async function listFolders(
  args: z.infer<typeof ListFoldersSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs("folders", { folder: args.folder }, args.vault),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}
