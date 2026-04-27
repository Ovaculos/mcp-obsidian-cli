import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_CONTENT = readFileSync(join(__dirname, "SKILL.md"), "utf-8");

import { SERVER_NAME, VERSION } from "./constants.js";
import {
  appendNote,
  createNote,
  deleteNote,
  listNotes,
  moveNote,
  prependNote,
  readNote,
} from "./handlers/files.js";
import {
  getProperty,
  listProperties,
  removeProperty,
  setProperty,
} from "./handlers/metadata.js";
import { searchContext, searchVault } from "./handlers/search.js";
import {
  getBacklinks,
  getLinks,
  getOutline,
  listDeadends,
  listOrphans,
  listTags,
  listUnresolved,
} from "./handlers/structure.js";
import { listFolders, vaultInfo } from "./handlers/vault.js";
import {
  AppendNoteSchema,
  CreateNoteSchema,
  DeleteNoteSchema,
  GetBacklinksSchema,
  GetLinksSchema,
  GetOutlineSchema,
  GetPropertySchema,
  ListDeadendsSchema,
  ListFoldersSchema,
  ListNotesSchema,
  ListOrphansSchema,
  ListPropertiesSchema,
  ListTagsSchema,
  ListUnresolvedSchema,
  MoveNoteSchema,
  PrependNoteSchema,
  ReadNoteSchema,
  RemovePropertySchema,
  SearchContextSchema,
  SearchVaultSchema,
  SetPropertySchema,
  VaultInfoSchema,
} from "./utils/schemas.js";

export function createServer(): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: VERSION });

  server.resource("skill-usage", "skill://obsidian-cli/usage", async (uri) => ({
    contents: [
      { uri: uri.href, text: SKILL_CONTENT, mimeType: "text/markdown" },
    ],
  }));

  // Files
  server.registerTool(
    "read_note",
    {
      description:
        "Read the contents of a note. Resolves by name (wikilink) or exact path.",
      inputSchema: ReadNoteSchema.shape,
      annotations: { readOnlyHint: true },
    },
    readNote,
  );

  server.registerTool(
    "create_note",
    {
      description:
        "Create a new note, optionally with content or from a template.",
      inputSchema: CreateNoteSchema.shape,
    },
    createNote,
  );

  server.registerTool(
    "append_note",
    {
      description: "Append content to a note.",
      inputSchema: AppendNoteSchema.shape,
    },
    appendNote,
  );

  server.registerTool(
    "prepend_note",
    {
      description: "Prepend content to a note.",
      inputSchema: PrependNoteSchema.shape,
    },
    prependNote,
  );

  server.registerTool(
    "delete_note",
    {
      description: "Delete a note (moves to trash unless permanent=true).",
      inputSchema: DeleteNoteSchema.shape,
      annotations: { destructiveHint: true },
    },
    deleteNote,
  );

  server.registerTool(
    "move_note",
    {
      description: "Move or rename a note to a new path.",
      inputSchema: MoveNoteSchema.shape,
    },
    moveNote,
  );

  server.registerTool(
    "list_notes",
    {
      description:
        "List files in the vault, optionally filtered by folder or extension.",
      inputSchema: ListNotesSchema.shape,
      annotations: { readOnlyHint: true },
    },
    listNotes,
  );

  // Search
  server.registerTool(
    "search_vault",
    {
      description:
        "Search the vault for text. Returns matching file paths as JSON.",
      inputSchema: SearchVaultSchema.shape,
      annotations: { readOnlyHint: true },
    },
    searchVault,
  );

  server.registerTool(
    "search_context",
    {
      description:
        "Search the vault for text with surrounding line context. Returns JSON.",
      inputSchema: SearchContextSchema.shape,
      annotations: { readOnlyHint: true },
    },
    searchContext,
  );

  // Metadata / Properties
  server.registerTool(
    "list_properties",
    {
      description:
        "List frontmatter properties across the vault or for a specific file. Returns JSON.",
      inputSchema: ListPropertiesSchema.shape,
      annotations: { readOnlyHint: true },
    },
    listProperties,
  );

  server.registerTool(
    "get_property",
    {
      description: "Read a specific frontmatter property value from a file.",
      inputSchema: GetPropertySchema.shape,
      annotations: { readOnlyHint: true },
    },
    getProperty,
  );

  server.registerTool(
    "set_property",
    {
      description: "Set a frontmatter property on a file.",
      inputSchema: SetPropertySchema.shape,
    },
    setProperty,
  );

  server.registerTool(
    "remove_property",
    {
      description: "Remove a frontmatter property from a file.",
      inputSchema: RemovePropertySchema.shape,
      annotations: { destructiveHint: true },
    },
    removeProperty,
  );

  // Structure / Links
  server.registerTool(
    "get_outline",
    {
      description: "Get the heading outline of a note as JSON.",
      inputSchema: GetOutlineSchema.shape,
      annotations: { readOnlyHint: true },
    },
    getOutline,
  );

  server.registerTool(
    "list_tags",
    {
      description: "List tags in the vault or a specific file. Returns JSON.",
      inputSchema: ListTagsSchema.shape,
      annotations: { readOnlyHint: true },
    },
    listTags,
  );

  server.registerTool(
    "get_backlinks",
    {
      description:
        "List files that link to a given file (backlinks). Returns JSON.",
      inputSchema: GetBacklinksSchema.shape,
      annotations: { readOnlyHint: true },
    },
    getBacklinks,
  );

  server.registerTool(
    "get_links",
    {
      description: "List outgoing links from a file.",
      inputSchema: GetLinksSchema.shape,
      annotations: { readOnlyHint: true },
    },
    getLinks,
  );

  server.registerTool(
    "list_unresolved",
    {
      description:
        "List unresolved (broken) wikilinks in the vault. Returns JSON.",
      inputSchema: ListUnresolvedSchema.shape,
      annotations: { readOnlyHint: true },
    },
    listUnresolved,
  );

  server.registerTool(
    "list_orphans",
    {
      description: "List files with no incoming links (orphans).",
      inputSchema: ListOrphansSchema.shape,
      annotations: { readOnlyHint: true },
    },
    listOrphans,
  );

  server.registerTool(
    "list_deadends",
    {
      description: "List files with no outgoing links (dead ends).",
      inputSchema: ListDeadendsSchema.shape,
      annotations: { readOnlyHint: true },
    },
    listDeadends,
  );

  // Vault Info
  server.registerTool(
    "vault_info",
    {
      description:
        "Show information about the current vault (name, path, file count, etc.).",
      inputSchema: VaultInfoSchema.shape,
      annotations: { readOnlyHint: true },
    },
    vaultInfo,
  );

  server.registerTool(
    "list_folders",
    {
      description:
        "List folders in the vault, optionally filtered by parent folder.",
      inputSchema: ListFoldersSchema.shape,
      annotations: { readOnlyHint: true },
    },
    listFolders,
  );

  return server;
}
