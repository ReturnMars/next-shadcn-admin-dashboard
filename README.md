# Studio Admin · Vite + TanStack Router

> **实际开发主线：`codex/develop`。** `main` / `origin/main` 保留原版 Next.js，仅用于接收源更新。接手项目或启动 AI 编码前，先确认分支；直接克隆远程默认 `main` 不会得到本项目的 Vite 版本。

从 [ReturnMars/next-shadcn-admin-dashboard](https://github.com/ReturnMars/next-shadcn-admin-dashboard) 迁移的管理后台模板，保留 Studio Admin 的页面、shadcn/ui组件、主题和布局。**不依赖 Next.js，也不需要Node应用服务器。** 上游作者 Arham Khan，MIT 许可保留。

技术栈：React、TypeScript、Vite、TanStack Router、TanStack Table、Tailwind CSS v4、shadcn/ui（radix-nova）、Zustand、React Hook Form、Zod。

## Getting started

进入 `admin-dashboard` 后先检查 `git branch --show-current` 和 `git status --short`。实际开发主线为 `codex/develop`（由 `codex/vite-tanstack` 重命名），应用基线提交为 `da2b354`；已有未提交工作时先核对其归属，再切换分支。任务分支和同步分支从开发主线创建，完成后合回开发主线。

目前应用分支只存在于本地，尚未推送。交接本地仓库时应包含 `codex/develop` 及其历史；未来经授权推送后，接收方需要显式获取并检出该分支，不能沿用远程默认 `main`。分支用途也记录在 `upstream-sync.json`。

使用 Node.js 22.12+ 或更新的受支持版本，npm安装：

```sh
npm ci
npm run dev
```

- 仪表盘：http://127.0.0.1:5173/dashboard/default
- 模板介绍：http://127.0.0.1:5173/
- 登录布局：http://127.0.0.1:5173/auth/v1/login

没有必填环境变量。此项目只提供模板演示，认证、业务持久化和服务端权限尚未接通；演示账号切换不代表身份切换。

## 页面与结构

保留默认、CRM、财务、分析、生产力、电商、学院、物流、基础设施、文件管理、患者监测等仪表盘，以及产品、聊天、邮件、日历、看板、任务、发票、档案、用户、角色、四个认证页和四个旧版仪表盘。保留明暗/系统主题、四套配色、19种字体、侧栏与顶栏设置。后台页面无最大宽度限制；展示、工作台及表单页面保留外层留白和卡片间距，表格、列表及监测等数据密集区域贴边。

```text
src/
  main.tsx                 # 浏览器启动、首次渲染前应用偏好
  router.ts                # TanStack Router实例与类型注册
  routes/                  # 路由定义、校验、元信息、布局装配
  routeTree.gen.ts          # 插件自动生成，禁止手改
  features/                # 各页面及就近组件/样例数据
  components/              # 共用UI与日历组件
  lib/                     # 偏好、字体、参数校验等
  stores/                  # Zustand界面状态
  styles/                  # 字体与主题预设
```

新增页面：在features中实现页面，在routes中创建对应createFileRoute模块，并按需更新navigation/sidebar。路由插件自动维护类型并拆分页面代码。内部导航用TanStack Link/useNavigate，外链用a。

## 验证

```sh
npm run build       # Vite构建与完整TypeScript检查
npm run typecheck
npm test
npm run check
npm run preview     # http://127.0.0.1:4173
npm run upstream:check # 获取 fork 的新增提交、文件差异和迁移目录映射，不改业务文件
```

`npm run generate:presets`重新提取主题预设信息；运行后审阅diff，不会自动提交。

组件命令使用本项目锁定的 CLI：`npx --no-install shadcn <命令>`。其依赖包含已验证的本地安全补丁，详情见[补丁说明](vendor/deepmerge/README.md)；升级 CLI 时同时检查补丁是否仍需保留。`npm test`会一并运行依赖安全与兼容回归，也可单独执行`npm run test:dependencies`。

后续更新从 `origin/main`（ReturnMars fork）获取，Vite 版本在 `codex/develop` 维护。`upstream-sync.json` 分别记录 `developmentBranch`、`sourceBranch` 和已完整审阅的源提交；先运行 `npm run upstream:check`，再从 `codex/develop` 建立隔离分支，按目录映射适配需要的改动，不在开发主线直接 `git pull origin main`。具体分支、基线推进和验收步骤见[同步 fork 更新](docs/migration.md#持续同步-fork-更新)。

## 静态部署

部署`dist/`，不部署源码和node_modules。开发/预览服务不用于生产。根路径托管可参考[nginx配置](deploy/nginx.conf)或现有vercel.json。刷新`/dashboard/file-manager?view=list`等深层地址必须返回index.html；`/assets/`等静态文件不存在时应返回404。

如需部署到子路径，需要同时设置Vite base和TanStack Router basepath，并验证所有静态资源和导航。本轮验收范围是根路径托管。

迁移依据、官方调研链接及已知边界见[迁移说明](docs/migration.md)。原NST项目在同级`../nst-workbench/`，两者的Git、依赖、数据与启动流程独立。
