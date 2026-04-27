import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import { buildArgs, runObsidian } from "../utils/cliClient.js";
import { errorResponse } from "../utils/errorResponse.js";
import type {
  AppendNoteSchema,
  CreateNoteSchema,
  DeleteNoteSchema,
  ListNotesSchema,
  MoveNoteSchema,
  PrependNoteSchema,
  ReadNoteSchema,
} from "../utils/schemas.js";

const ok = (text: string): CallToolResult => ({
  content: [{ type: "text", text }],
});

export async function readNote(
  args: z.infer<typeof ReadNoteSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs("read", { file: args.file, path: args.path }, args.vault),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function createNote(
  args: z.infer<typeof CreateNoteSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "create",
          {
            name: args.name,
            path: args.path,
            content: args.content,
            template: args.template,
            overwrite: args.overwrite,
          },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function appendNote(
  args: z.infer<typeof AppendNoteSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "append",
          {
            file: args.file,
            path: args.path,
            content: args.content,
            inline: args.inline,
          },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function prependNote(
  args: z.infer<typeof PrependNoteSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "prepend",
          {
            file: args.file,
            path: args.path,
            content: args.content,
            inline: args.inline,
          },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function deleteNote(
  args: z.infer<typeof DeleteNoteSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "delete",
          { file: args.file, path: args.path, permanent: args.permanent },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function moveNote(
  args: z.infer<typeof MoveNoteSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs(
          "move",
          { file: args.file, path: args.path, to: args.to },
          args.vault,
        ),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function listNotes(
  args: z.infer<typeof ListNotesSchema>,
): Promise<CallToolResult> {
  try {
    return ok(
      await runObsidian(
        buildArgs("files", { folder: args.folder, ext: args.ext }, args.vault),
      ),
    );
  } catch (e) {
    return errorResponse(e);
  }
}
