export const MOCK_NOTE_CONTENT = "# My Note\n\nSome content here.";
export const MOCK_FILE_LIST = "notes/foo.md\nnotes/bar.md\nnotes/baz.md";
export const MOCK_SEARCH_JSON = JSON.stringify([
  { file: "notes/foo.md", matches: 2 },
  { file: "notes/bar.md", matches: 1 },
]);
export const MOCK_TAGS_JSON = JSON.stringify([
  { tag: "project", count: 5 },
  { tag: "idea", count: 3 },
]);
export const MOCK_VAULT_INFO =
  "Name: My Vault\nPath: /Users/me/Documents/Obsidian/My Vault\nFiles: 142\nFolders: 12";
