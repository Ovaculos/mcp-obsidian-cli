import { describe, expect, it } from "vitest";
import { buildArgs, CliError, cleanEnv } from "../src/utils/cliClient.js";

describe("CliError", () => {
  it("creates error with code and message", () => {
    const err = new CliError(1, "command not found");
    expect(err.code).toBe(1);
    expect(err.message).toBe("command not found");
    expect(err.name).toBe("CliError");
    expect(err).toBeInstanceOf(Error);
  });
});

describe("buildArgs", () => {
  it("returns command as first arg", () => {
    expect(buildArgs("read", {})[0]).toBe("read");
  });

  it("prepends vault arg when provided", () => {
    const args = buildArgs("read", {}, "MyVault");
    expect(args).toContain("vault=MyVault");
    expect(args.indexOf("vault=MyVault")).toBe(1);
  });

  it("includes key=value pairs for string opts", () => {
    const args = buildArgs("read", { file: "My Note", path: undefined });
    expect(args).toContain("file=My Note");
    expect(args).not.toContain("path=undefined");
  });

  it("includes flag-only arg for boolean true", () => {
    const args = buildArgs("delete", { permanent: true });
    expect(args).toContain("permanent");
  });

  it("omits arg for boolean false", () => {
    const args = buildArgs("delete", { permanent: false });
    expect(args).not.toContain("permanent");
  });

  it("omits arg for undefined values", () => {
    const args = buildArgs("read", { file: undefined, path: undefined });
    expect(args).toHaveLength(1);
  });

  it("includes numeric values as strings", () => {
    const args = buildArgs("search", { limit: 10 });
    expect(args).toContain("limit=10");
  });
});

describe("cleanEnv", () => {
  it("returns undefined for unset value", () => {
    expect(cleanEnv(undefined)).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(cleanEnv("")).toBeUndefined();
  });

  it("returns undefined for unsubstituted user_config placeholder", () => {
    expect(cleanEnv("${user_config.obsidian_bin}")).toBeUndefined();
    expect(cleanEnv("${user_config.obsidian_vault}")).toBeUndefined();
  });

  it("returns undefined for any unsubstituted ${...} template", () => {
    expect(cleanEnv("${HOME}")).toBeUndefined();
  });

  it("passes through real paths", () => {
    expect(cleanEnv("/Applications/Obsidian.app/Contents/MacOS/obsidian")).toBe(
      "/Applications/Obsidian.app/Contents/MacOS/obsidian",
    );
    expect(cleanEnv("MyVault")).toBe("MyVault");
  });

  it("does not strip values that merely contain ${ inside", () => {
    expect(cleanEnv("/some/path/$weird/file")).toBe("/some/path/$weird/file");
  });
});
