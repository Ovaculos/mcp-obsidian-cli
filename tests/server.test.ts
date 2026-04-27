import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createServer } from "../src/app.js";
import {
  MOCK_FILE_LIST,
  MOCK_NOTE_CONTENT,
  MOCK_SEARCH_JSON,
  MOCK_TAGS_JSON,
  MOCK_VAULT_INFO,
} from "./fixtures.js";

const { mockRunObsidian } = vi.hoisted(() => ({
  mockRunObsidian: vi.fn<[string[]], Promise<string>>(),
}));

vi.mock("../src/utils/cliClient.js", async (importOriginal) => {
  const actual =
    (await importOriginal()) as typeof import("../src/utils/cliClient.js");
  return { ...actual, runObsidian: mockRunObsidian };
});

describe("obsidian-cli MCP server", () => {
  let client: Client;

  beforeAll(async () => {
    const server = createServer();
    client = new Client({ name: "test-client", version: "0.0.0" });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);
  });

  afterAll(async () => {
    await client.close();
  });

  function getText(result: Awaited<ReturnType<typeof client.callTool>>) {
    return (result.content as Array<{ type: string; text: string }>)[0].text;
  }

  it("registers all 22 tools", async () => {
    const { tools } = await client.listTools();
    expect(tools).toHaveLength(22);
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual([
      "append_note",
      "create_note",
      "delete_note",
      "get_backlinks",
      "get_links",
      "get_outline",
      "get_property",
      "list_deadends",
      "list_folders",
      "list_notes",
      "list_orphans",
      "list_properties",
      "list_tags",
      "list_unresolved",
      "move_note",
      "prepend_note",
      "read_note",
      "remove_property",
      "search_context",
      "search_vault",
      "set_property",
      "vault_info",
    ]);
  });

  it("read_note returns CLI output", async () => {
    mockRunObsidian.mockResolvedValueOnce(MOCK_NOTE_CONTENT);
    const result = await client.callTool({
      name: "read_note",
      arguments: { file: "My Note" },
    });
    expect(getText(result)).toBe(MOCK_NOTE_CONTENT);
    expect(mockRunObsidian).toHaveBeenCalledWith(
      expect.arrayContaining(["read", "file=My Note"]),
    );
  });

  it("read_note returns error on CLI failure", async () => {
    const { CliError } = await import("../src/utils/cliClient.js");
    mockRunObsidian.mockRejectedValueOnce(new CliError(1, "File not found"));
    const result = await client.callTool({ name: "read_note", arguments: {} });
    expect(result.isError).toBe(true);
    expect(getText(result)).toContain("CLI error 1");
  });

  it("list_notes returns file list", async () => {
    mockRunObsidian.mockResolvedValueOnce(MOCK_FILE_LIST);
    const result = await client.callTool({ name: "list_notes", arguments: {} });
    expect(getText(result)).toBe(MOCK_FILE_LIST);
  });

  it("search_vault requests json format", async () => {
    mockRunObsidian.mockResolvedValueOnce(MOCK_SEARCH_JSON);
    const result = await client.callTool({
      name: "search_vault",
      arguments: { query: "project" },
    });
    expect(getText(result)).toBe(MOCK_SEARCH_JSON);
    expect(mockRunObsidian).toHaveBeenCalledWith(
      expect.arrayContaining(["search", "query=project", "format=json"]),
    );
  });

  it("list_tags requests json format", async () => {
    mockRunObsidian.mockResolvedValueOnce(MOCK_TAGS_JSON);
    const result = await client.callTool({ name: "list_tags", arguments: {} });
    expect(getText(result)).toBe(MOCK_TAGS_JSON);
    expect(mockRunObsidian).toHaveBeenCalledWith(
      expect.arrayContaining(["format=json"]),
    );
  });

  it("vault_info returns vault details", async () => {
    mockRunObsidian.mockResolvedValueOnce(MOCK_VAULT_INFO);
    const result = await client.callTool({ name: "vault_info", arguments: {} });
    expect(getText(result)).toBe(MOCK_VAULT_INFO);
  });

  it("delete_note has destructiveHint annotation", async () => {
    const { tools } = await client.listTools();
    const deleteTool = tools.find((t) => t.name === "delete_note");
    expect(deleteTool?.annotations?.destructiveHint).toBe(true);
  });

  it("read_note has readOnlyHint annotation", async () => {
    const { tools } = await client.listTools();
    const readTool = tools.find((t) => t.name === "read_note");
    expect(readTool?.annotations?.readOnlyHint).toBe(true);
  });
});
