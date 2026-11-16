import { z } from "zod";

import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const configSchema = z.strictObject({
  repository: z.string().min(1),
  remote: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/),
  branch: z.string().min(1),
  reviewedCommit: z.string().regex(/^[0-9a-f]{40}$/),
});

const movedDirectories = [
  ["src/app/(main)/dashboard/(legacy)/", "src/features/dashboard/"],
  ["src/app/(main)/dashboard/", "src/features/dashboard/"],
  ["src/app/(main)/auth/", "src/features/auth/"],
  ["src/app/(main)/chat/", "src/features/chat/"],
  ["src/app/(main)/mail/", "src/features/mail/"],
  ["src/app/(main)/unauthorized/", "src/features/unauthorized/"],
  ["src/app/(external)/", "src/features/landing/"],
];

const frameworkEntrypoints = new Set([
  "src/app/layout.tsx",
  "src/app/(main)/dashboard/page.tsx",
  "src/app/(main)/dashboard/(legacy)/layout.tsx",
  "src/app/(main)/dashboard/[...not-found]/page.tsx",
]);

export function mapSourcePath(path) {
  if (
    frameworkEntrypoints.has(path) ||
    /^(?:package(?:-lock)?\.json|(?:next|postcss|tailwind)\.config\.[^/]+|tsconfig[^/]*|vercel\.json)$/.test(path) ||
    path.startsWith("src/server/")
  ) {
    return { target: null, kind: "框架/依赖：按 Vite 架构人工适配" };
  }
  for (const [source, target] of movedDirectories) {
    if (path.startsWith(source)) {
      return { target: target + path.slice(source.length), kind: "迁移目录：审阅框架调用及本地布局" };
    }
  }
  if (path.startsWith("src/app/") && path !== "src/app/globals.css" && path !== "src/app/not-found.tsx") {
    return { target: null, kind: "Next 入口：人工确认对应实现" };
  }
  return { target: path, kind: "同路径：审阅本地差异后移植" };
}

export function parseChanges(output) {
  const fields = output.split("\0");
  fields.pop();
  const changes = [];
  for (let index = 0; index < fields.length; ) {
    const status = fields[index++];
    const oldPath = fields[index++];
    const renamed = status.startsWith("R") || status.startsWith("C");
    const path = renamed ? fields[index++] : oldPath;
    changes.push({ status, path, ...(renamed ? { oldPath } : {}) });
  }
  return changes;
}

export function checkUpstream(cwd) {
  const config = configSchema.parse(JSON.parse(readFileSync(resolve(cwd, "upstream-sync.json"), "utf8")));
  const git = (...args) =>
    execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 20 * 1024 * 1024,
    });

  git("check-ref-format", `refs/heads/${config.branch}`);
  const remoteUrl = git("remote", "get-url", config.remote).trim();
  if (remoteUrl !== config.repository) {
    throw new Error(`远程地址与 upstream-sync.json 不一致：${remoteUrl}。请先确认同步来源。`);
  }
  git("cat-file", "-e", `${config.reviewedCommit}^{commit}`);
  const trackingRef = `refs/remotes/${config.remote}/${config.branch}`;
  // Refresh the remote-tracking cache only; the ancestry check below rejects rewritten source history.
  git("fetch", "--no-tags", config.remote, `+refs/heads/${config.branch}:${trackingRef}`);
  const target = git("rev-parse", "--verify", `${trackingRef}^{commit}`).trim();
  const ancestry = spawnSync("git", ["merge-base", "--is-ancestor", config.reviewedCommit, target], {
    cwd,
    encoding: "utf8",
  });
  if (ancestry.error) throw ancestry.error;
  if (ancestry.status === 1) throw new Error("源分支历史已改变，已审阅基线不再是目标祖先；停止自动比较，请人工核对。");
  if (ancestry.status !== 0) throw new Error(ancestry.stderr || "无法核对源分支历史。");

  return {
    source: `${config.remote}/${config.branch}`,
    base: config.reviewedCommit,
    target,
    dirty: git("status", "--porcelain").length > 0,
    commits: Number(git("rev-list", "--count", `${config.reviewedCommit}..${target}`).trim()),
    history: git("log", "--reverse", "--oneline", `${config.reviewedCommit}..${target}`, "--").trim(),
    changes: parseChanges(git("diff", "--name-status", "-z", "--find-renames", config.reviewedCommit, target, "--")),
  };
}

function main() {
  const cwd = fileURLToPath(new URL("../", import.meta.url));
  const report = checkUpstream(cwd);
  console.log(`来源：${report.source}\n已审阅：${report.base}\n本次目标：${report.target}`);
  console.log(`待审阅 ${report.commits} 个提交，${report.changes.length} 个文件变更。`);
  if (report.history) console.log(`\n源提交：\n${report.history}`);
  if (report.dirty) console.log("当前工作区有未提交改动；检查未修改业务文件。首次移植前先固化本地基线。");
  for (const change of report.changes) {
    const mapping = mapSourcePath(change.path);
    console.log(`\n${change.status} ${change.oldPath ? `${change.oldPath} -> ` : ""}${change.path}`);
    if (change.oldPath) console.log(`  原本地位置：${mapSourcePath(change.oldPath).target ?? "需人工确认"}`);
    console.log(`  本地位置：${mapping.target ?? "需人工确认"}\n  ${mapping.kind}`);
  }
  console.log("\n只执行 fetch 与差异检查；未合并、提交、推送，也未推进已审阅基线。流程见 docs/migration.md。");
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
