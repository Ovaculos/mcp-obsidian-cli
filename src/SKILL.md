---
name: mcp-obsidian-cli
description: Guides tool selection and correct argument usage for the obsidian-cli MCP server.
---

## Tools

| Tool | Use when... |
|------|-------------|
| `read_note` | You need the full content of a specific note |
| `create_note` | You need to create a new note |
| `append_note` | You want to add content to the end of an existing note |
| `prepend_note` | You want to add content to the top of an existing note |
| `delete_note` | You need to remove a note |
| `move_note` | You need to relocate or rename a note |
| `list_notes` | You need to browse files in the vault |
| `search_vault` | You need to find notes matching a text query |
| `search_context` | You need search results with surrounding line context |
| `list_properties` | You need frontmatter properties vault-wide or for a specific file |
| `get_property` | You need a single property value from a file |
| `set_property` | You need to write or update a frontmatter property |
| `remove_property` | You need to delete a frontmatter property |
| `get_outline` | You need the heading structure of a note |
| `list_tags` | You need to see tags in the vault or a file |
| `get_backlinks` | You need to know what links to a given note |
| `get_links` | You need to know what a note links to |
| `list_unresolved` | You need to find broken wikilinks |
| `list_orphans` | You need to find notes no other note links to |
| `list_deadends` | You need to find notes that link nowhere |
| `vault_info` | You need vault name, path, or file/folder counts |
| `list_folders` | You need to browse the folder structure |

## Argument Reference

### Targeting notes

Every tool that operates on a specific file accepts two mutually exclusive targeting args:

- `file`: note name, resolved like a wikilink (e.g. `"My Note"`, `"Project Plan"`)
- `path`: exact vault-relative path (e.g. `"work/Project Plan.md"`)

Use `file` when you have a name. Use `path` when you have a path from a previous tool result.

All tools also accept `vault` to target a non-active vault by name.

### File operations

```
read_note(file="My Note")
read_note(path="journal/2024-01-15.md")

create_note(name="Project Plan", content="# Project Plan\n\nTODO")
create_note(path="work/ideas/new-feature.md", template="Daily Note")
create_note(name="Scratch", overwrite=true)

append_note(file="My Note", content="\n## New Section\n\nContent here")
append_note(path="journal/today.md", content=" quick addition", inline=true)

prepend_note(file="README", content="# Updated Title\n\n")

delete_note(file="Draft")                  # moves to trash
delete_note(path="temp/scratch.md", permanent=true)  # permanent delete

move_note(file="Old Name", to="archive/")          # move to folder
move_note(file="Old Name", to="new/path/Note.md")  # move and rename

list_notes()                               # all files
list_notes(folder="work/projects")         # filter by folder
list_notes(ext="md")                       # markdown only
```

### Search

```
search_vault(query="project deadline")
search_vault(query="TODO", path="work/", limit=20)
search_vault(query="API key", case_sensitive=true)

search_context(query="meeting notes")      # returns matching lines with context
search_context(query="bug fix", limit=10)
```

### Frontmatter properties

```
list_properties()                          # all properties across vault
list_properties(file="My Note")            # properties on one file

get_property(name="status", file="My Note")
get_property(name="tags", path="work/todo.md")

set_property(name="status", value="done", file="My Note")
set_property(name="priority", value="high", type="text", file="My Note")
set_property(name="due", value="2025-02-01", type="date", path="work/task.md")
set_property(name="done", value="true", type="checkbox", file="Task")

remove_property(name="draft", file="My Note")
```

### Structure and links

```
get_outline(file="My Note")                # headings as JSON
get_outline(path="docs/architecture.md")

list_tags()                                # all tags in vault
list_tags(counts=true)                     # with occurrence counts
list_tags(file="My Note")                  # tags on one file

get_backlinks(file="My Note")              # what links to this note
get_backlinks(file="My Note", counts=true)

get_links(file="My Note")                  # what this note links to

list_unresolved()                          # broken wikilinks
list_unresolved(counts=true, verbose=true)

list_orphans()                             # no incoming links
list_deadends()                            # no outgoing links
```

### Vault info

```
vault_info()
list_folders()
list_folders(folder="work")    # subfolders of work/
```

## Context Reuse

- `search_vault` / `list_notes` return paths → pass as `path=` to `read_note`, `get_outline`, `get_backlinks`, etc.
- `get_outline` headings reveal structure → decide where to `append_note` relative to existing content
- `list_properties()` vault-wide identifies property names → use those names in `get_property` / `set_property`
- `get_backlinks` / `get_links` return file paths → chain into `read_note` to traverse the graph

## Workflows

### 1. Find and read a note
1. `search_vault(query=<terms>)` — get matching paths
2. `read_note(path=<result>)` — read the best match
3. Optionally `get_outline(path=<result>)` — inspect structure before editing

### 2. Create a structured note with metadata
1. `create_note(name=<name>, content=<markdown>)`
2. `set_property(name="tags", value=<tag>, file=<name>)`
3. `set_property(name="status", value="active", file=<name>)`

### 3. Vault health audit
1. `list_orphans()` — notes no one links to
2. `list_deadends()` — notes that link nowhere
3. `list_unresolved()` — broken wikilinks
4. For each: `read_note(path=<file>)` to decide whether to link, archive, or delete

### 4. Traverse a topic through links
1. `search_vault(query=<topic>)` — seed set
2. `get_links(path=<note>)` — outgoing links
3. `get_backlinks(path=<note>)` — incoming links
4. `read_note(path=<linked note>)` — follow each link
