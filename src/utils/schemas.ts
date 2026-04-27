import { z } from "zod";

// --- Files ---

export const ReadNoteSchema = z.object({
  file: z
    .string()
    .optional()
    .describe("File name (wikilink style, e.g. 'My Note')"),
  path: z
    .string()
    .optional()
    .describe("Exact file path (e.g. 'folder/note.md')"),
  vault: z.string().optional().describe("Target vault name"),
});

export const CreateNoteSchema = z.object({
  name: z.string().optional().describe("File name for the new note"),
  path: z
    .string()
    .optional()
    .describe("Exact path for the new note (e.g. 'folder/note.md')"),
  content: z.string().optional().describe("Initial content"),
  template: z.string().optional().describe("Template name to use"),
  overwrite: z.boolean().optional().describe("Overwrite if file exists"),
  vault: z.string().optional().describe("Target vault name"),
});

export const AppendNoteSchema = z.object({
  content: z.string().describe("Content to append"),
  file: z.string().optional().describe("File name"),
  path: z.string().optional().describe("Exact file path"),
  inline: z.boolean().optional().describe("Append without leading newline"),
  vault: z.string().optional().describe("Target vault name"),
});

export const PrependNoteSchema = z.object({
  content: z.string().describe("Content to prepend"),
  file: z.string().optional().describe("File name"),
  path: z.string().optional().describe("Exact file path"),
  inline: z.boolean().optional().describe("Prepend without trailing newline"),
  vault: z.string().optional().describe("Target vault name"),
});

export const DeleteNoteSchema = z.object({
  file: z.string().optional().describe("File name"),
  path: z.string().optional().describe("Exact file path"),
  permanent: z
    .boolean()
    .optional()
    .describe("Skip trash and delete permanently"),
  vault: z.string().optional().describe("Target vault name"),
});

export const MoveNoteSchema = z.object({
  to: z.string().describe("Destination folder or full path"),
  file: z.string().optional().describe("File name"),
  path: z.string().optional().describe("Exact file path"),
  vault: z.string().optional().describe("Target vault name"),
});

export const ListNotesSchema = z.object({
  folder: z.string().optional().describe("Filter by folder path"),
  ext: z.string().optional().describe("Filter by extension (e.g. 'md')"),
  vault: z.string().optional().describe("Target vault name"),
});

// --- Search ---

export const SearchVaultSchema = z.object({
  query: z.string().describe("Search query text"),
  path: z.string().optional().describe("Limit search to folder"),
  limit: z.number().int().optional().describe("Maximum number of results"),
  case_sensitive: z.boolean().optional().describe("Case-sensitive search"),
  vault: z.string().optional().describe("Target vault name"),
});

export const SearchContextSchema = z.object({
  query: z.string().describe("Search query text"),
  path: z.string().optional().describe("Limit search to folder"),
  limit: z.number().int().optional().describe("Maximum number of results"),
  case_sensitive: z.boolean().optional().describe("Case-sensitive search"),
  vault: z.string().optional().describe("Target vault name"),
});

// --- Metadata / Properties ---

export const ListPropertiesSchema = z.object({
  file: z
    .string()
    .optional()
    .describe("File name (omit for vault-wide properties)"),
  path: z.string().optional().describe("Exact file path"),
  vault: z.string().optional().describe("Target vault name"),
});

export const GetPropertySchema = z.object({
  name: z.string().describe("Property name"),
  file: z.string().optional().describe("File name"),
  path: z.string().optional().describe("Exact file path"),
  vault: z.string().optional().describe("Target vault name"),
});

export const SetPropertySchema = z.object({
  name: z.string().describe("Property name"),
  value: z.string().describe("Property value"),
  type: z
    .enum(["text", "list", "number", "checkbox", "date", "datetime"])
    .optional()
    .describe("Property type"),
  file: z.string().optional().describe("File name"),
  path: z.string().optional().describe("Exact file path"),
  vault: z.string().optional().describe("Target vault name"),
});

export const RemovePropertySchema = z.object({
  name: z.string().describe("Property name"),
  file: z.string().optional().describe("File name"),
  path: z.string().optional().describe("Exact file path"),
  vault: z.string().optional().describe("Target vault name"),
});

// --- Structure / Links ---

export const GetOutlineSchema = z.object({
  file: z.string().optional().describe("File name"),
  path: z.string().optional().describe("Exact file path"),
  vault: z.string().optional().describe("Target vault name"),
});

export const ListTagsSchema = z.object({
  file: z.string().optional().describe("File name (omit for vault-wide tags)"),
  path: z.string().optional().describe("Exact file path"),
  counts: z.boolean().optional().describe("Include tag occurrence counts"),
  vault: z.string().optional().describe("Target vault name"),
});

export const GetBacklinksSchema = z.object({
  file: z.string().optional().describe("File name"),
  path: z.string().optional().describe("Exact file path"),
  counts: z.boolean().optional().describe("Include link counts"),
  vault: z.string().optional().describe("Target vault name"),
});

export const GetLinksSchema = z.object({
  file: z.string().optional().describe("File name"),
  path: z.string().optional().describe("Exact file path"),
  vault: z.string().optional().describe("Target vault name"),
});

export const ListUnresolvedSchema = z.object({
  counts: z.boolean().optional().describe("Include link counts"),
  verbose: z.boolean().optional().describe("Include source files"),
  vault: z.string().optional().describe("Target vault name"),
});

export const ListOrphansSchema = z.object({
  all: z.boolean().optional().describe("Include non-markdown files"),
  vault: z.string().optional().describe("Target vault name"),
});

export const ListDeadendsSchema = z.object({
  all: z.boolean().optional().describe("Include non-markdown files"),
  vault: z.string().optional().describe("Target vault name"),
});

// --- Vault Info ---

export const VaultInfoSchema = z.object({
  vault: z.string().optional().describe("Target vault name"),
});

export const ListFoldersSchema = z.object({
  folder: z.string().optional().describe("Filter by parent folder"),
  vault: z.string().optional().describe("Target vault name"),
});
