import { checkUpstream, mapSourcePath, parseChanges } from "./upstream-check.mjs";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "admin-upstream-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const source = join(directory, "source");
  const local = join(directory, "local");
  mkdirSync(source);
  const git = (cwd, ...args) =>
    execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  const write = (root, path, content) => {
    const destination = join(root, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, content);
  };
  const commit = (message) => {
    git(source, "add", "--all");
    git(source, "-c", "commit.gpgsign=false", "-c", "core.hooksPath=/dev/null", "commit", "-m", message);
    return git(source, "rev-parse", "HEAD");
  };
  git(source, "init", "-b", "main");
  git(source, "config", "user.name", "Fixture");
  git(source, "config", "user.email", "fixture@example.invalid");
  write(source, "src/app/(main)/dashboard/finance/page.tsx", "export default function Page() { return 'finance'; }\n");
  write(source, "src/components/old.tsx", "export const name = 'old';\n");
  const base = commit("source baseline");
  git(directory, "clone", "--no-hardlinks", source, local);
  git(local, "switch", "-c", "codex/develop");
  const config = {
    repository: source,
    remote: "origin",
    sourceBranch: "main",
    developmentBranch: "codex/develop",
    reviewedCommit: base,
  };
  write(local, "upstream-sync.json", JSON.stringify(config));
  return { directory, source, local, base, config, git, write, commit };
}

test("maps moved pages and legacy files without mistaking removed Next entrypoints for application files", () => {
  assert.equal(
    mapSourcePath("src/app/(main)/dashboard/(legacy)/crm-v1/page.tsx").target,
    "src/features/dashboard/crm-v1/page.tsx",
  );
  assert.equal(mapSourcePath("src/app/(external)/page.tsx").target, "src/features/landing/page.tsx");
  assert.equal(mapSourcePath("src/app/(main)/auth/v1/login/page.tsx").target, "src/features/auth/v1/login/page.tsx");
  assert.equal(mapSourcePath("src/app/(main)/dashboard/(legacy)/layout.tsx").target, null);
  assert.equal(mapSourcePath("src/app/(main)/dashboard/page.tsx").target, null);
  assert.equal(mapSourcePath("package-lock.json").target, null);
  assert.equal(mapSourcePath("src/components/ui/button.tsx").target, "src/components/ui/button.tsx");
});

test("parses renames, deletions and whitespace in Git's NUL-delimited paths", () => {
  assert.deepEqual(parseChanges("R100\0old\tname.tsx\0new\nname.tsx\0D\0deleted.tsx\0"), [
    { status: "R100", oldPath: "old\tname.tsx", path: "new\nname.tsx" },
    { status: "D", path: "deleted.tsx" },
  ]);
});

test("fetches new changes while preserving dirty files, the index, HEAD and the reviewed cursor", (t) => {
  const { source, local, base, git, write, commit } = fixture(t);
  assert.equal(checkUpstream(local).commits, 0);
  write(local, "src/components/old.tsx", "local staged customization\n");
  git(local, "add", "src/components/old.tsx");
  write(local, "src/components/old.tsx", "local unstaged customization\n");
  const status = git(local, "status", "--porcelain");
  const staged = git(local, "diff", "--cached");
  const configBefore = readFileSync(join(local, "upstream-sync.json"), "utf8");
  renameSync(join(source, "src/components/old.tsx"), join(source, "src/components/new.tsx"));
  write(source, "next.config.ts", "export default {};\n");
  const target = commit("rename component and update Next config");
  const report = checkUpstream(local);
  assert.equal(report.base, base);
  assert.equal(report.developmentBranch, "codex/develop");
  assert.equal(report.currentBranch, "codex/develop");
  assert.equal(report.source, "origin/main");
  assert.equal(report.target, target);
  assert.equal(report.commits, 1);
  assert.match(report.history, /rename component and update Next config/);
  assert.equal(report.dirty, true);
  assert.ok(report.changes.some((change) => change.status === "R100" && change.path === "src/components/new.tsx"));
  assert.ok(report.changes.some((change) => change.status === "A" && change.path === "next.config.ts"));
  assert.equal(git(local, "rev-parse", "HEAD"), base);
  assert.equal(git(local, "status", "--porcelain"), status);
  assert.equal(git(local, "diff", "--cached"), staged);
  assert.equal(readFileSync(join(local, "src/components/old.tsx"), "utf8"), "local unstaged customization\n");
  assert.equal(readFileSync(join(local, "upstream-sync.json"), "utf8"), configBefore);
});

test("rejects a changed source URL before fetching", (t) => {
  const { source, local, git } = fixture(t);
  git(local, "remote", "set-url", "origin", `${source}-other`);
  assert.throws(() => checkUpstream(local), /远程地址与 upstream-sync.json 不一致/);
});

test("fails explicitly on rewritten source history without advancing the cursor", (t) => {
  const { source, local, base, git, commit } = fixture(t);
  git(source, "checkout", "--orphan", "rewritten");
  commit("unrelated source history");
  git(source, "branch", "-M", "main");
  assert.throws(() => checkUpstream(local), /源分支历史已改变/);
  assert.equal(JSON.parse(readFileSync(join(local, "upstream-sync.json"), "utf8")).reviewedCommit, base);
  assert.equal(git(local, "rev-parse", "HEAD"), base);
});

test("reports a fetch failure instead of presenting cached refs as current", (t) => {
  const { source, local, base, git } = fixture(t);
  renameSync(source, `${source}-unavailable`);
  assert.throws(() => checkUpstream(local), /Command failed: git fetch/);
  assert.equal(git(local, "rev-parse", "HEAD"), base);
});
