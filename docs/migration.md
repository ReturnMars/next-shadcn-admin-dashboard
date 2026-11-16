# 从 Next.js 迁移到 Vite + TanStack Router

核对日期：2026-11-16。来源：[ReturnMars/next-shadcn-admin-dashboard](https://github.com/ReturnMars/next-shadcn-admin-dashboard)，基线提交 `3d1d6f4abf4231b258c81da25da1ccbc38d9b954`，上游 Studio Admin 2.2.0，MIT 许可。

## 结论与选择依据

采用 **React + TypeScript + Vite + TanStack Router 文件路由**。保留 Tailwind v4、shadcn/ui radix-nova、Zustand、React Hook Form/Zod、TanStack Table 和现有可视化组件。产物是 `dist/` 静态文件，无 Next 运行时、服务器组件或 Server Actions。

这不是“所有项目都应该用SPA”的结论：React官方默认推荐框架，也明确支持在有特定约束时从Vite等构建工具起步。本项目的目标是保留后台模板并移除Next；源码没有需要服务端渲染的真实业务接口，因此浏览器应用能满足本轮范围。[React官方说明](https://react.dev/learn/creating-a-react-app)

| 方案 | 对本项目的取舍 |
| --- | --- |
| Vite + TanStack Router | 采用。独立路由库；文件路由生成类型，支持参数校验、嵌套布局和按页拆包，适合保留30余个页面的后台模板 |
| Vite + React Router Data Mode | 同样可行，可直接使用路由和数据API、控制打包与服务端实现。结合用户对TanStack的偏好和当前页面URL状态需求，选择前者 |
| TanStack Start | 当前不采用。将全栈框架引入纯前端模板没有对应的服务端需求；未来确有SSR或服务端函数需求时另行评估 |
| TanStack Query | 暂不安装。它解决远程服务状态的请求、缓存、同步和更新；当前业务页使用静态样例，把样例套进Query没有实际收益 |

来源：[TanStack Router入门](https://tanstack.com/router/latest/docs/quick-start)、[类型安全](https://tanstack.com/router/latest/docs/guide/type-safety)、[React Router模式选择](https://reactrouter.com/start/modes)、[TanStack Query职责](https://tanstack.com/query/latest/docs/framework/react/overview)。

## 源码核对与迁移范围

已检查路由页和布局、导航与搜索、主题/字体/持久化、认证表单、图表/表格/日历/拖拽看板、邮件分栏、图片、配置和部署入口。仓库原有344个src文件；大量功能是普通React组件，Next耦合集中在入口、页面路由和少数服务端读操作。没有把未实现的演示按钮改称业务能力。

| 原实现 | 当前实现 |
| --- | --- |
| App Router路由组、layout/page自动装配 | `src/routes`显式文件路由，`src/features`保留页面及专属组件；共享仪表盘、邮件、聊天、v2认证布局保持 |
| next/link、next/navigation | TanStack Link、useNavigate、useLocation、getRouteApi；外链为原生a |
| 服务端searchParams、看板history.pushState | 路由边界Zod校验view，组件读取类型明确的状态；更改视图产生可后退的URL |
| next/headers与Server Actions读取偏好 | 浏览器cookie，在React首次渲染前校验并应用；Zustand更新DOM与持久偏好；保留系统主题响应 |
| 邮件服务端JSON.parse(cookie) | 客户端校验分栏数组；损坏偏好明确告警并恢复默认分栏，不阻断页面 |
| next/font/google、Geist的Next字体导出 | Fontsource可变字体与本地Geist Pixel/Serif资源；原19种字体选择保留，无运行时Google字体请求 |
| next/image | 原生img，保留尺寸、alt及产品缩略图延迟加载；静态图片由Vite导入 |
| Metadata、ImageResponse | TanStack head/HeadContent管理标题和描述；本地SVG图标 |
| next build、Next部署配置 | Vite构建+TypeScript校验；静态托管与SPA回退示例；删除原Vercel跳转到作者站点的规则 |
| 上游Google Analytics跟踪代码 | 移除，避免新项目向原作者统计账号上报访问 |
| 演示登录/注册将密码写进toast | 仅提示表单校验与尚待接通认证API，不展示密码 |

保留原URL，包括首页、仪表盘、四个旧版仪表盘、四个认证页面、独立聊天/邮件、无权限页与404。`/dashboard`仍跳转默认仪表盘。没有删减复杂页面来完成迁移，也没有建立Next API兼容壳。

TanStack官方建议Vite路由插件在React插件之前，并可开启自动拆包；本项目按此配置。路由生成文件进入版本管理，格式工具忽略它。[Vite集成](https://tanstack.com/router/latest/docs/installation/with-vite)

文件管理的`?view=list`与看板的`?view=table`经过边界校验；未知值分别选默认grid/board，URL刷新与浏览器前进后退保持一致。[URL状态与校验](https://tanstack.com/router/latest/docs/guide/search-params)

字体由npm依赖及本地许可资源自托管，可变字体保持原选择能力。浏览器只请求实际使用的字形集合；新增字体不通过远程CSS动态注入。[Fontsource官方安装说明](https://fontsource.org/docs/getting-started/install)

## 运行、部署及后续边界

- `npm run dev`为开发服务；`npm run build`输出dist并检查类型；`npm run preview`仅本地验收构建，不当作生产服务器。[Vite部署说明](https://vite.dev/guide/static-deploy.html)
- 生产托管必须将未知页面路径回退到index.html，同时让缺失的静态资源返回404；否则刷新深层URL会失败。示例见README和deploy/nginx.conf。
- 这是客户端管理界面，动态页面的元信息在浏览器更新，不承诺与SSR相同的搜索引擎或分享预览能力。
- 登录、注册、角色、产品和其他业务操作保留上游演示性质。下一切片应由新项目的实际业务目标决定，再接认证与API；不自动关联旧NST系统，也不搬运病例、密钥或模型调用预算。
- 原数据中的外部头像/图片和GitHub星数仍依赖外部资源；未承诺所有演示数据离线可用。

## 本轮验收（2026-11-16）

- 上游36个page入口逐一核对：35个固定地址（含dashboard跳转）全部保留；Next catch-all 404由Router根级notFoundComponent接管。无Next相关代码导入，依赖树也不含next、next-themes或Geist的Next包。
- `npm run build`与完整TypeScript校验通过；路由自动拆包，主JS约436KB（gzip约136KB），图表/日历等按页面加载。字体资源只在对应字形被使用时请求。
- `npm test`共22项通过：原13项覆盖URL参数、首次渲染偏好、无效cookie、系统主题、重置偏好、邮件分栏及地图无网络渲染；新增9项依赖安全与兼容回归见下。
- `npm run check`零错误；保留上游highlighter中的1项数组索引key警告，未放宽规则。`git diff --check`通过。
- 完整`npm audit`报告零漏洞（含开发依赖）；此前shadcn CLI链上的6项告警已处理，具体修复及本地补丁的审计边界见下。
- 已在浏览器逐页打开仪表盘、业务模板、独立聊天/邮件和认证页；验证文件列表刷新、看板视图的前进后退、明暗主题及字体/预设/宽度持久化、搜索导航和移动端侧栏；390px视口无页面横向溢出。
- 通过Vite preview验收生产构建：深层URL直接打开与刷新保持文件列表视图；`/dashboard`跳转默认仪表盘；全局与dashboard下的未知路径均显示404。
- 浏览器发现上游物流CDN请求失败：现在将原world-atlas@2.0.2数据与许可本地保存，按路由打包，Zod在边界校验后交给地图组件。已确认地图和运输路线可见，无需CDN。来源与校验值见map-data/README.md。

尚未接通真实认证或业务API，未做生产部署；静态托管配置仍需在实际部署平台验收。

## 依赖安全修复（2026-11-16）

6项告警源于2个底层问题，并传递到shadcn、@shadcn/registry、ts-morph和@ts-morph/common。修复仅涉及开发依赖；生产依赖锁定记录与业务源码保持一致。

| 依赖 | 修复与兼容措施 |
| --- | --- |
| minimatch 10.2.6 | 在@ts-morph/common下精确override为11.0.8。保留原ts-morph/shadcn版本，验证普通匹配、globstar、扩展名集合、隐藏文件、否定匹配及ts-morph的文件选择和import修改。[公告](https://github.com/advisories/GHSA-g3hv-75wg-m249) |
| deepmerge 4.3.1 | 官方尚无修复版本。已先复现返回对象原型被污染的问题，再保留上游实现，仅在来源和目标复制入口拦截__proto__；通过本地包替换两个CLI使用方。保留MIT许可与可审阅的两处代码差异，不删除CLI或停用审计。[公告](https://github.com/advisories/GHSA-gcqx-w48m-w2h4)、[本地补丁说明](../vendor/deepmerge/README.md) |

本地包不由npm公告库审计，因此不能仅凭audit为零认定修复有效。9项依赖回归直接加载CLI实际使用的依赖，验证原型攻击、空原型目标、嵌套空值、目标复制、getter、数组、symbol、克隆和自定义合并等行为。上游发布修复后应替换本地补丁并保留回归。

验证结果：完整audit为0；22项测试、构建与类型检查通过；Biome无新增告警（仍为原highlighter的1项警告）。在临时项目副本执行`npm ci --ignore-scripts`，再次运行依赖回归，使用本地shadcn CLI实际生成测试组件、合并明暗主题CSS，并通过TypeScript检查；未把测试组件写入实际项目。浏览器刷新默认仪表盘，图表和表格正常，无控制台错误。

## 后续布局统一（2026-11-16）

所有后台页面共用全宽画布，移除外层最大宽度。用户进一步明确：全宽不等于贴边。财务、学院、生产力、旧版财务等展示/工作台页面，以及发票表单与预览页，保留移动端 16px、桌面端 24px 的外层内边距和卡片间距；表格、列表、监测等数据密集区域继续贴边，混合页面按分区控制留白。主题、字体、顶栏行为和侧栏设置继续保留。

“居中 / 全宽”开关和 `content_layout` 偏好已退役。历史 cookie 不再读取，切换页面、刷新和恢复默认不会重新应用 1536px 上限。原偏好持久化测试改用仍受支持的顶栏行为，并新增旧居中 cookie 的启动及重置回归。

全宽改动已对 26 个后台页面在 1920px、2560px 检查公共顶栏及内容容器，均无宽度上限；页面内部按上述展示或数据操作场景保留相应间距。财务、学院、生产力、发票、日历、旧版财务和聊天/邮件预览在 390px 无页面横向溢出。日历月/周切换、发票数量与金额预览联动、嵌入工作区加载正常。23 项测试、构建及类型检查通过，Biome 仅保留原 highlighter 的 1 项警告。

### 按页面用途复核

进一步逐页检查全部 26 个后台页面及替代视图，按以下规则保留现有页面结构和交互：

| 页面或区域 | 布局规则 |
| --- | --- |
| 财务、学院、生产力、旧版财务、发票、日历 | 展示/工作台外层保留移动端 16px、桌面端 24px 留白 |
| 默认、CRM、电商、分析，以及旧版默认/CRM/分析 | 展示卡片保留留白，嵌入表格贴齐数据分区边界 |
| 文件管理、看板 | 网格/卡片视图保留留白，列表/表格视图贴边 |
| 个人档案 | 页头、标签及信息正文对齐；文档表格贴边 |
| 产品、用户、任务、角色、基础设施 | 数据表贴边；标题和筛选控件保留必要内边距 |
| 物流、患者监测、聊天和邮件预览 | 列表、监测及详情分栏铺满可用操作区域 |
| Coming soon 及各展示型占位标签页 | 保留内容留白，不设页面最大宽度 |

修正了档案头部与正文的 8px 错位、文件网格标题的对齐、看板卡片区域的四周间距，并恢复日历外层留白；分析及角色的非默认占位标签页也保留留白。没有修改数据、事件处理、筛选、路由或拖拽逻辑。

验证：26 个页面 × 1920px / 2560px / 390px，共 78 次公共布局测量，页面均填满可用宽度、无最大宽度限制及页面横向溢出；7 个混合仪表盘的展示卡片在 2560px 下至少保留 24px 外侧留白。确认档案文档表格、文件列表和看板表格继续贴边，受影响的手机工具栏无横向裁切。档案/分析/角色标签页、文件视图与角色搜索、日历月周切换、看板三种视图及列拖拽通过浏览器验证。构建、类型检查、23 项测试通过；Biome 无新增警告。

## 持续同步 fork 更新

本项目与原版已经有框架、目录、依赖安全和布局差异。采用“保留原版源分支，按增量适配应用分支”的方式持续同步，不全量覆盖或直接合并 Next 分支，也不重新搬回旧目录来减少表面冲突。目录映射已集中在 `scripts/upstream-check.mjs`。

### 分支与来源

**实际开发主线固定为 `codex/develop`**，原 `codex/vite-tanstack` 已重命名。接手的人和 AI 开始修改前，先检查 `git branch --show-current` 与 `git status --short`。

| 分支 | 用途 | 开发与合入方向 |
| --- | --- | --- |
| `codex/develop` | 长期维护的 Vite 应用开发主线 | 日常开发；接收任务分支和同步适配结果 |
| 从 `codex/develop` 创建的 `codex/<任务名>` | 独立开发任务 | 完成后合回 `codex/develop` |
| `codex/sync-upstream-<目标短 SHA>` | 隔离处理源更新 | 从 `codex/develop` 创建，适配和验证后合回它 |
| 本地 `main` / `origin/main` | 原版 Next.js 源更新 | 仅跟踪和比较源代码，不用于 Vite 应用开发 |

- `origin` 保持指向 `ReturnMars/next-shadcn-admin-dashboard`，其 `main` 接收原版更新；Vite 版本在 `codex/develop`。以后发布应用分支时也保留这一区分，不把 Vite 版本推到原版 `main`。
- GitHub 已核实该仓库 fork 自 `arhamkhnz/next-shadcn-admin-dashboard`。本项目同步 ReturnMars fork；如需作者仓库的新功能，先将其更新同步到 fork，再从同一来源适配，避免混用两套源历史。
- `upstream-sync.json` 明确区分 `developmentBranch: codex/develop` 和 `sourceBranch: main`。`reviewedCommit` 是**已逐项审阅完成的源提交**，不是本地应用提交。初始为 `3d1d6f4abf4231b258c81da25da1ccbc38d9b954`。2026-11-16 检查时 fork 的 `main` 仍为该提交，没有待同步更新。
- 应用基线 `da2b354` 包含 Vite/TanStack 迁移、依赖安全修复、按页面用途区分的全宽布局，以及同步检查工具。后续从 `codex/develop` 的最新应用提交建立同步工作树，不从原版 `3d1d6f4` 建立；同步前仍须确认本地新工作已提交。提交、推送遵循 AGENTS.md 的用户授权约定。
- 当前应用分支只在本地。交接本地仓库时必须包含 `codex/develop`；未来获授权推送后，接收者需要显式检出该分支。远程默认 `main` 仍是原版，不能把默认克隆结果当成当前应用。本轮重命名不改远程默认分支，也不推送。

### 每次同步

1. 在应用项目运行 `npm run upstream:check`。命令校验来源，fetch 指定分支，并报告 `reviewedCommit..目标提交` 的完整差异和旧新路径映射。它只刷新 Git 远程跟踪信息，不改 HEAD、暂存区、业务文件或同步基线。来源地址不符、网络失败、基线缺失或源历史改写时明确失败，不拿缓存结果冒充最新状态。
2. 如果没有新增提交，本轮结束。有更新时，先确认应用基线已提交，再从 `codex/develop` 建立 `codex/sync-upstream-<目标短 SHA>` 分支及独立 worktree。使用已报告的固定目标 SHA；适配途中来源又更新时，留待下一轮处理。`git worktree add -b <同步分支> <独立目录> codex/develop` 可让同步工作不影响日常开发目录。
3. 对比源提交区间，逐项移植需要的改动。共享组件可参考原 diff；被搬迁的页面按脚本提示找到 `src/features` 下的对应位置。路径提示不代表补丁可直接应用，重命名和删除也要检查本地引用。新增页面必须同时接入 TanStack 路由；不要把未接入路由的原版文件当成已完成新功能。
4. 框架入口、Next 配置、Server Actions、字体及图片加载按 Vite 架构重新适配；`package.json` 和锁文件逐项核对，不整份替换，保留仍必要的安全补丁。主题、筛选、分页、拖拽等行为与本地布局规则同时保留。
5. 在同步分支运行 `npm ci`、`npm run build`、`npm test`、`npm run check`、`git diff --check`，并验证受影响的交互与 390px / 1920px / 2560px 布局。已有警告要与基线区分；新增依赖变更再运行 `npm audit` 并评估实际影响。
6. 在本节末追加本轮记录：源起止 SHA、已移植内容、不适用内容及理由、验证结果。**只有整个源提交区间都已处理完**，才将 `reviewedCommit` 改为本轮固定目标，并与代码一起提交。若只挑选了部分功能，先记录已移植源提交，基线暂不推进，避免漏掉尚未审阅的更新。
7. 审阅同步分支的最终 diff，再合回 `codex/develop`；先确认当前工作区干净并位于 `codex/develop`，仅在能够快进时使用 `git merge --ff-only <同步分支>`。若开发主线期间有新提交，先解决与本地新工作的冲突并重验。发布时推送 `codex/develop`，不覆盖 fork 的原版 `main`。

不使用 `merge -s ours` 伪造已同步记录，也不通过自动选择全部 ours/theirs 掩盖差异。这个流程保留源历史和明确的审阅游标，允许持续接收更新，但框架分歧意味着无法承诺无人工适配的一键同步。

依据：[Git fetch](https://git-scm.com/docs/git-fetch) 负责获取远程对象与引用；[Git worktree](https://git-scm.com/docs/git-worktree) 提供隔离工作目录。增量移植及独立审阅游标是针对本项目框架分歧的维护选择。

同步工具验证：新增 6 项回归使用独立临时 Git 仓库，覆盖目录映射、重命名/删除路径解析、获取更新时保留工作区与暂存区、来源变化、历史改写和 fetch 失败。全部 29 项测试、构建及类型检查通过，保留原有 1 项 highlighter 静态检查警告。

### 本地应用基线（2026-11-16）

迁移、布局、依赖补丁及同步流程整理为一个完整基线提交，保留原 fork 的 Git 历史和源同步游标。构建产物、依赖目录及浏览器验证截图不进入版本控制；截图继续保留在本地 `docs/screenshots/`。此基线仅在本地提交，未推送远程。

提交钩子中的主题生成脚本使用 `createRequire(import.meta.url)` 解析 Biome 路径，兼容迁移后的 ESM 执行环境；保留生成和格式检查步骤。

基线验收从暂存树导出独立目录，执行全新 `npm ci`、主题生成、构建及类型检查、29 项测试和 Biome 检查；全部通过，保留原 highlighter 的 1 项警告。安装和生成流程未改动快照中的版本文件。
