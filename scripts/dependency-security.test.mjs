import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const cliRequire = createRequire(require.resolve("shadcn"));
const registryRequire = createRequire(cliRequire.resolve("@shadcn/registry"));
const deepmerge = cliRequire("deepmerge");
const { Project } = cliRequire("ts-morph");
const morphRequire = createRequire(cliRequire.resolve("ts-morph"));
const commonRequire = createRequire(morphRequire.resolve("@ts-morph/common"));
const { minimatch } = commonRequire("minimatch");

function assertSafePrototype(value) {
  assert.equal(Object.getPrototypeOf(value), Object.prototype);
  assert.equal(value.injectedFlag, undefined);
  assert.equal(Object.hasOwn(value, "__proto__"), false);
}

test("both shadcn consumers resolve the patched merge implementation", () => {
  assert.equal(registryRequire.resolve("deepmerge"), cliRequire.resolve("deepmerge"));
  assert.match(cliRequire.resolve("deepmerge"), /vendor\/deepmerge\/index\.cjs$/);
});

test("rejects source prototype keys for ordinary and null-prototype targets", () => {
  const source = JSON.parse('{"__proto__":{"injectedFlag":true},"safe":42}');
  for (const target of [{}, Object.create(null)]) {
    const result = deepmerge(target, source);
    assertSafePrototype(result);
    assert.equal(result.safe, 42);
  }
});

test("rejects nested prototype keys with null, undefined and primitive placeholders", () => {
  const source = JSON.parse('{"session":{"__proto__":{"injectedFlag":true},"theme":"dark"}}');
  for (const session of [null, undefined, false, 0, "", {}]) {
    const result = deepmerge({ session }, source);
    assertSafePrototype(result.session);
    assert.equal(result.session.theme, "dark");
  }
});

test("rejects own prototype keys copied from the target, including nested array items", () => {
  const target = JSON.parse('{"__proto__":{"injectedFlag":true},"items":[{"__proto__":{"injectedFlag":true}}]}');
  const result = deepmerge(target, {});
  assertSafePrototype(result);
  assertSafePrototype(result.items[0]);
});

test("does not evaluate a forbidden prototype getter", () => {
  const input = Object.defineProperty({}, "__proto__", {
    enumerable: true,
    get() {
      throw new Error("Forbidden key was read");
    },
  });
  assertSafePrototype(deepmerge(input, {}));
  assertSafePrototype(deepmerge({}, input));
});

test("preserves shadcn nested config merges, dependency arrays, and array replacement", () => {
  const base = {
    aliases: { ui: "@/components/ui" },
    cssVars: { light: { primary: "black" } },
    dependencies: ["react"],
  };
  const incoming = {
    aliases: { utils: "@/lib/utils" },
    cssVars: { light: { radius: "0.5rem" } },
    dependencies: ["radix-ui"],
  };
  const result = deepmerge(base, incoming);
  assert.deepEqual(result.aliases, { ui: "@/components/ui", utils: "@/lib/utils" });
  assert.deepEqual(result.cssVars.light, { primary: "black", radius: "0.5rem" });
  assert.deepEqual(result.dependencies, ["react", "radix-ui"]);
  assert.deepEqual(deepmerge.all([["react"], ["radix-ui"]]), ["react", "radix-ui"]);
  assert.deepEqual(deepmerge(base, incoming, { arrayMerge: (_target, source) => source }).dependencies, ["radix-ui"]);
  result.cssVars.light.primary = "white";
  assert.equal(base.cssVars.light.primary, "black");
});

test("retains custom merges, symbol properties, clone:false, Date and RegExp behavior", () => {
  const key = Symbol("config");
  const date = new Date("2026-01-01");
  const pattern = /component/;
  const original = { [key]: { enabled: true }, date, pattern };
  const result = deepmerge({}, original);
  assert.deepEqual(result[key], { enabled: true });
  assert.notEqual(result[key], original[key]);
  assert.equal(result.date, date);
  assert.equal(result.pattern, pattern);
  assert.equal(deepmerge({}, original, { clone: false })[key], original[key]);
  assert.deepEqual(
    deepmerge(
      { aliases: { old: true } },
      { aliases: { next: true } },
      {
        customMerge: (name) => (name === "aliases" ? (_target, source) => source : undefined),
      },
    ),
    { aliases: { next: true } },
  );
});

test("minimatch retains the glob features used by ts-morph", () => {
  assert.equal(commonRequire("minimatch/package.json").version, "11.0.8");
  assert.equal(minimatch("src/components/button.tsx", "src/**/*.{ts,tsx}"), true);
  assert.equal(minimatch("src/components/button.css", "src/**/*.{ts,tsx}"), false);
  assert.equal(minimatch("src/.hidden.ts", "src/**/*.ts"), false);
  assert.equal(minimatch("src/.hidden.ts", "src/**/*.ts", { dot: true }), true);
  assert.equal(minimatch("src/app.ts", "!**/*.test.ts"), true);
});

test("ts-morph can select component files and update their imports", () => {
  const project = new Project({ useInMemoryFileSystem: true });
  project.createSourceFile("/src/button.tsx", "export const Button = () => <button />;");
  project.createSourceFile("/src/nested/card.tsx", "export const Card = () => <section />;");
  project.createSourceFile("/src/button.test.ts", "export const test = true;");
  const selected = project.getSourceFiles(["/src/**/*.tsx", "!/src/**/*.test.ts"]);
  assert.deepEqual(selected.map((file) => file.getBaseName()).sort(), ["button.tsx", "card.tsx"]);
  selected[0].addImportDeclaration({ namedImports: ["cn"], moduleSpecifier: "@/lib/utils" });
  assert.equal(selected[0].getImportDeclaration("@/lib/utils").getNamedImports()[0].getName(), "cn");
  assert.match(selected[0].getFullText(), /export const Button/);
});
