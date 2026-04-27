# mcp-obsidian-cli

[![mpak](https://img.shields.io/badge/mpak-registry-blue)](https://mpak.dev/packages/@ovaculos/obsidian-cli)
[![NimbleBrain](https://img.shields.io/badge/NimbleBrain-nimblebrain.ai-purple)](https://nimblebrain.ai)

MCP server wrapping the [Obsidian](https://obsidian.md) CLI. Gives Claude Code (and any MCP client) full read/write access to your Obsidian vaults via 22 tools covering file CRUD, full-text search, frontmatter properties, link graph traversal, and vault info.

## Tools

| Category | Tools |
|---|---|
| Files | `read_note`, `create_note`, `append_note`, `prepend_note`, `delete_note`, `move_note`, `list_notes` |
| Search | `search_vault`, `search_context` |
| Properties | `list_properties`, `get_property`, `set_property`, `remove_property` |
| Structure | `get_outline`, `list_tags`, `get_backlinks`, `get_links`, `list_unresolved`, `list_orphans`, `list_deadends` |
| Vault | `vault_info`, `list_folders` |

## Requirements

- Node.js 24+
- [Obsidian](https://obsidian.md) installed (binary at `/Applications/Obsidian.app/Contents/MacOS/obsidian` on macOS, or set `OBSIDIAN_BIN`)
- [`mpak`](https://nimblebrain.ai) (to run the bundle)

## Configuration

| Env var | Default | Description |
|---|---|---|
| `OBSIDIAN_BIN` | `/Applications/Obsidian.app/Contents/MacOS/obsidian` (macOS) | Path to the Obsidian binary |
| `OBSIDIAN_VAULT` | — | Default vault name; tools accept `vault=` per-call to override |

## Install via mpak

```bash
mpak install @ovaculos/obsidian-cli
```

## Local dev

```bash
npm install
make check    # format + typecheck + tests
make run      # build and run stdio server
make bundle   # build .mcpb bundle
```

Inspect locally:

```bash
make bundle
npx @modelcontextprotocol/inspector mpak run --local ./*.mcpb
```

## Version management

`manifest.json` is the single source of truth.

```bash
make bump VERSION=0.2.0   # update manifest + sync package.json, server.json, src/constants.ts
make sync                  # re-sync without bumping
```
