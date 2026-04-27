#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./app.js";
import { SERVER_NAME, VERSION } from "./constants.js";

const server = createServer();

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${SERVER_NAME} MCP server v${VERSION} running on stdio`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
