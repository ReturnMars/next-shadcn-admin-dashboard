# deepmerge 本地安全补丁

这是 `deepmerge@4.3.1` 的最小修改副本，仅供 shadcn CLI 和其 registry 使用。保留上游 MIT 许可、CommonJS API 和类型声明；不发布到 npm，不进入浏览器代码。

上游仍无修复版本：[GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4)。本项目已复现：向 `{ session: null }` 合并包含 `session.__proto__` 的 JSON 会改变结果对象的原型。

补丁只在目标和来源的两个复制入口跳过 `__proto__`，且在读取属性值之前拦截，保留其他键、数组、自定义合并和克隆选项的原行为。具体差异见 `security.patch`，同类上游讨论见 [PR #274](https://github.com/TehShrike/deepmerge/pull/274)；该 PR 未合并，不宣称是官方发布修复。

通过根 package.json 的开发依赖 `deepmerge: file:./vendor/deepmerge` 和 npm overrides 的 `$deepmerge` 引用，将两个 deepmerge 使用方指向此目录。根依赖保证相对路径在全新安装时也能正确解析。独立包名用于明确区分本地修改与官方包；npm audit 不会审计这段本地代码，修复是否有效由 `npm run test:dependencies` 的实际依赖解析、漏洞复现和兼容检查验证，不能仅以 audit 为零作为依据。

上游发布修复后，升级 shadcn 或 deepmerge、移除此 override 和 vendor 目录，并保留相应安全回归。修改前必须运行依赖测试与 shadcn 组件生成检查。
