# Admin Dashboard 开发约定

## 开始工作先确认分支

**实际开发主线及 GitHub 默认分支：`codex/develop`。** 这是长期维护的 Vite 应用分支；原名 `codex/vite-tanstack`，已重命名，不再使用旧名。

- 本地 `main` / `origin/main` 是原版 Next.js 更新来源，不是本项目的开发或交付分支，不在其上编写应用功能。
- 先运行 `git branch --show-current` 与 `git status --short`。日常开发在 `codex/develop`，任务分支和 `codex/sync-upstream-*` 均从它创建、最终合回它。
- 基线提交为 `da2b354`。在其他分支工作前确认它继承了该应用基线及所需后续开发；不能仅凭分支名、远程默认分支或 `main` 判断代码版本。
- 发现分支不对时，先保护并核对已有工作，不执行 reset、强制切换或整份覆盖。普通克隆默认检出 `codex/develop`，其远程跟踪分支是 `origin/codex/develop`；旧克隆可能仍停在 `main`，接手时不能省略分支检查。
- 机器可读的分支用途见 `upstream-sync.json`：`developmentBranch` 是应用开发主线，`sourceBranch` 是源更新分支。两者不可互换。

## 项目约定

这是从 ReturnMars/next-shadcn-admin-dashboard 迁移的 React SPA。使用 Vite、TanStack Router、TypeScript、Tailwind CSS v4、shadcn/ui（radix-nova），不使用 Next.js、SSR、Server Actions 或 TanStack Start。

- 先读 README.md 和 docs/migration.md。旧 NST 项目位于同级 `../nst-workbench`，与本项目没有运行或数据依赖。
- 使用 npm 与 package-lock.json；`npm ci` 安装，`npm run dev` 启动，`npm run build` 构建并做类型检查，`npm test` 做迁移回归，`npm run check` 检查格式和静态规则。
- shadcn 命令使用 `npx --no-install shadcn`，确保采用本项目锁定的 CLI 及依赖安全修复。当前 deepmerge 使用 vendor/deepmerge 中的最小补丁，minimatch override 限定在 @ts-morph/common 下；升级前读补丁说明，并运行 `npm run test:dependencies`，不直接移除 override 或绕过本地依赖调用临时下载的 CLI。
- `src/routes` 只定义路由、URL参数校验、页面元信息和布局；由 TanStack Vite 插件生成 `src/routeTree.gen.ts`，不要手改生成文件。新页面必须注册路由。
- 页面与专属组件、数据就近放在 `src/features/<feature>`；复用组件在 `src/components`，共享逻辑在 `src/lib`。不为未出现的复用增加抽象。
- 内部导航使用 TanStack Link/useNavigate/getRouteApi，外部地址使用原生 a。不要直接修改 history 来更新业务视图。URL、持久偏好和未来API响应在接收边界校验后传入内部。
- Zustand管理界面偏好；有真实API后，服务端状态采用 TanStack Query，先明确缓存、失效和权限规则，不把静态演示数据包一层Query。
- 保留现有视觉设计、响应式布局、语义色与主题预设。使用项目内 `.agents/skills/shadcn/SKILL.md`；先看本地UI组件实现。组件通常保持上游形态，确有框架迁移或缺陷需求时集中修改并验证。
- TypeScript strict；禁止用 any 或强制断言掩盖运行时边界问题。沿用 @/ 别名、Biome和现有代码风格。
- 按影响行为进行类型、构建、自动化和浏览器验证；不得以跳过检查、移除页面或放宽断言通过迁移验收。测试和演示不等于真实业务接通。
- 本模板没有真实身份认证或业务API，不保存或展示用户输入的密码，不把演示角色或前端隐藏菜单视作权限控制。
- 保留 MIT 许可证与来源信息，未经用户指示不提交、推送或部署。
- 同步 fork 前读 `docs/migration.md` 的“持续同步 fork 更新”。来源固定为 `upstream-sync.json` 指定的 `origin/main`，先运行 `npm run upstream:check`；应用分支不直接 pull/merge 源 Next 分支。按完整提交区间在隔离分支移植，逐项记录不适用的改动，通过验收后才更新 `reviewedCommit`，不能把 fetch 成功当作同步完成。

## 已确认的界面偏好

后台页面均不限制最大宽度，但是否贴边取决于内容：展示、工作台页面保留留白；表格、列表及监测等数据密集区域采用「贴边、紧凑、干脆」的布局。

- 公共布局的顶栏和内容容器始终铺满可用宽度、不设最大宽度。页面自行控制留白，不能把“全宽”理解为所有内容都必须贴边。
- 财务、学院、生产力、旧版财务等展示/工作台页面，以及发票这类表单与预览页，保留统一的外层内边距（移动端 16px、桌面端 24px）和卡片间距，标题、工具栏、卡片对齐同一内边界。
- 产品、用户、任务、角色等表格/列表及患者监测页面继续贴边，以 `/dashboard/products` 和 `/dashboard/patient-monitoring` 为参考。混合页面中，图表与展示分区保留留白，表格贴齐所在数据分区；不要给整页统一去除或叠加内边距。
- 同一页面的不同视图按内容分别处理：文件网格、看板卡片保留 16px / 24px 留白，切换为列表或表格时贴边；档案信息保留留白，文档表格贴边。日历作为工作台保留外层留白；物流、聊天、邮件的列表与详情分栏继续铺满操作区域。
- 检查所有标签页和替代视图，不能只检查默认视图。展示型空状态也保留留白；页头、分区标题和展示内容使用相同的 16px / 24px 对齐线。
- 已移除 `content_layout` 偏好及“居中 / 全宽”开关；旧 cookie 不参与初始化，刷新、恢复默认或切换页面都不能重新限宽。宽度验收包含 1920px、2560px，不能仅凭 1440px 视口判断贴边效果。
- 标题、筛选工具栏、数据区、分页按顺序紧密排列。表格主体优先使用平直边界，减少圆角卡片包裹、阴影和层层内边距。
- 单元格保留必要的文字内边距，行高和控件间距紧凑，列对齐明确；可读性和点击区域仍需保证。
- 用位置、对齐、细线和必要的状态色组织信息，减少重复标题与辅助说明。后续新增或调整表格及数据密集页面时遵循此方向。
- 普通数据表使用 `src/app/globals.css` 中的 `table-compact` 工具类：40px 表头、48px 基准行高、单元格横向 16px / 纵向 8px 内边距及细分隔线。双行内容可自然增高；列宽、对齐和交互留在各页面组件中，不再叠加整表单元格间距覆盖。
- 任务、用户、角色等独立列表使用内容区剩余高度，表体独立滚动、表头固定、分页留在底部；嵌入仪表盘的表格贴齐所在分区，其他图表保留必要内边距。窄屏横向滚动限制在表格内部，工具栏和分页允许换行。
