import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import { buildArgs, runObsidian } from "../utils/cliClient.js";
import { errorResponse } from "../utils/errorResponse.js";
import type {
  GetBacklinksSchema,
  GetLinksSchema,
  GetOutlineSchema,
  ListDeadendsSchema,
  ListOrphansSchema,
  ListTagsSchema,
  ListUnresolvedSchema,
} from "../utils/schemas.js";

const ok = (text: string): CallToolResult => ({
  content: [{ type: "text", text }],
});

export async function getOutline(
  args: z.infer<typeof GetOutlineSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "outline",
          { file: args.file, path: args.path, format: "json" },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function listTags(
  args: z.infer<typeof ListTagsSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "tags",
          {
            file: args.file,
            path: args.path,
            counts: args.counts,
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

export async function getBacklinks(
  args: z.infer<typeof GetBacklinksSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "backlinks",
          {
            file: args.file,
            path: args.path,
            counts: args.counts,
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

export async function getLinks(
  args: z.infer<typeof GetLinksSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs("links", { file: args.file, path: args.path }, args.vault),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function listUnresolved(
  args: z.infer<typeof ListUnresolvedSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "unresolved",
          { counts: args.counts, verbose: args.verbose, format: "json" },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function listOrphans(
  args: z.infer<typeof ListOrphansSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(buildArgs("orphans", { all: args.all }, args.vault)),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function listDeadends(
  args: z.infer<typeof ListDeadendsSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(buildArgs("deadends", { all: args.all }, args.vault)),
    );
  } catch (e) {
    return errorResponse(e);
  }
}
