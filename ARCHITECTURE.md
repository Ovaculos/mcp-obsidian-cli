# Architecture

How `mcp-obsidian-cli` is structured.

## File tree

```
src/
├── index.ts              # Stdio entrypoint — connects McpServer to StdioServerTransport
├── server.ts             # HTTP entrypoint — Streamable HTTP via Express (for Docker/cloud)
├── app.ts                # McpServer factory — createServer() registers all 22 tools + skill resource
├── constants.ts          # SERVER_NAME + VERSION (managed by `make sync`, never edit manually)
├── SKILL.md              # Embedded skill resource (copied to build/ by Makefile)
├── handlers/
│   ├── files.ts          # read_note, create_note, append_note, prepend_note, delete_note, move_note, list_notes
│   ├── search.ts         # search_vault, search_context
│   ├── metadata.ts       # list_properties, get_property, set_property, remove_property
│   ├── structure.ts      # get_outline, list_tags, get_backlinks, get_links, list_unresolved, list_orphans, list_deadends
│   └── vault.ts          # vault_info, list_folders
└── utils/
    ├── cliClient.ts      # runObsidian() + buildArgs() — execFile wrapper for the Obsidian CLI
    ├── config.ts         # Loads OBSIDIAN_BIN and OBSIDIAN_VAULT from env
    ├── errorResponse.ts  # Converts any thrown error → MCP CallToolResult { isError: true }
    └── schemas.ts        # Zod input schemas for all 22 tools

tests/
├── server.test.ts        # Integration tests via InMemoryTransport (mocks runObsidian)
├── client.test.ts        # Unit tests for CliError + buildArgs
└── fixtures.ts           # Mock CLI output strings
```

## CLI client

All tools run via `runObsidian(args)` in `src/utils/cliClient.ts`. The Obsidian CLI takes positional arguments in the form:

```
obsidian <command> [vault=<name>] [key=value ...] [flag ...]
```

`buildArgs(command, opts, vaultOverride?)` builds this array from a plain object — string/number values become `key=value`, booleans become bare flags (truthy) or are omitted (falsy).

## Handler pattern

Each handler follows this pattern:

```typescript
export async function readNote(args: z.infer<typeof ReadNoteSchema>): Promise<CallToolResult> {
  try {
    return ok(await runObsidian(buildArgs("read", { file: args.file, path: args.path }, args.vault)));
  } catch (e) {
    return errorResponse(e);
  }
}
```

- `ok(text)` — wraps plain text in `{ content: [{ type: "text", text }] }`
- `errorResponse(e)` — wraps `CliError` or generic error as `{ isError: true }`
- Tools that return structured data pass `format: "json"` and the CLI returns JSON strings

## Skill resource

`src/SKILL.md` is embedded as an MCP resource at `skill://obsidian-cli/usage`. It documents tool selection and argument reference for Claude Code. Copied to `build/SKILL.md` by `make build`; included in the bundle via `.mcpbignore` negation `!build/SKILL.md`.

## Version management

`manifest.json` → `make sync` → `package.json`, `server.json`, `src/constants.ts`. Run `make bump VERSION=x.y.z` to bump.
