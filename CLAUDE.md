# mcp-obsidian-cli

MCP server wrapping the Obsidian CLI. No API key — uses the local `obsidian` binary.

See [README.md](README.md) for user-facing docs and [ARCHITECTURE.md](ARCHITECTURE.md) for code structure.

## Building the bundle

`manifest.json` is the single source of truth for the version. Run `make sync` after editing it by hand.

```bash
make check   # format + typecheck + tests
make bundle  # compile → prune dev deps → pack .mcpb
```

To bump the version:

```bash
make bump VERSION=0.2.0  # updates manifest.json and syncs package.json, server.json, src/constants.ts
```

## Testing — stdio

```bash
make build
npx @modelcontextprotocol/inspector node build/index.js --stdio
```

Or end-to-end via the bundle:

```bash
make bundle
npx @modelcontextprotocol/inspector mpak run --local ./*.mcpb
```

Set `OBSIDIAN_BIN` if your binary is not at the default macOS path, and `OBSIDIAN_VAULT` to target a specific vault.

## Testing — HTTP with Docker

```bash
npm run docker:build
npm run docker:run      # binds to localhost:3000
npm run inspect:http    # connect MCP Inspector
```

The container exposes `POST/GET/DELETE /mcp` (Streamable HTTP) and `GET /health`.
