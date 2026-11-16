# Contributing

保留上游MIT许可与作者信息。本分支使用Vite和TanStack Router，开始前请阅读README.md、AGENTS.md和docs/migration.md。

使用npm ci安装、npm run dev开发。路由位于src/routes，功能组件就近保存在src/features；使用项目现有shadcn组件和语义主题变量。不要手改src/routeTree.gen.ts。

提交前按改动范围运行npm run build、npm test和npm run check；界面改动在桌面、窄屏和暗色模式验证。报告验证限制，不将样例表单和数据描述为真实业务。提交沿用conventional commits；推送和部署由用户明确授权。
