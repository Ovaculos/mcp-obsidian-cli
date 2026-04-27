import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import { buildArgs, runObsidian } from "../utils/cliClient.js";
import { errorResponse } from "../utils/errorResponse.js";
import type {
  GetPropertySchema,
  ListPropertiesSchema,
  RemovePropertySchema,
  SetPropertySchema,
} from "../utils/schemas.js";

const ok = (text: string): CallToolResult => ({
  content: [{ type: "text", text }],
});

export async function listProperties(
  args: z.infer<typeof ListPropertiesSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "properties",
          { file: args.file, path: args.path, format: "json" },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function getProperty(
  args: z.infer<typeof GetPropertySchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "property:read",
          { name: args.name, file: args.file, path: args.path },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function setProperty(
  args: z.infer<typeof SetPropertySchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "property:set",
          {
            name: args.name,
            value: args.value,
            type: args.type,
            file: args.file,
            path: args.path,
          },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function removeProperty(
  args: z.infer<typeof RemovePropertySchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "property:remove",
          { name: args.name, file: args.file, path: args.path },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}
