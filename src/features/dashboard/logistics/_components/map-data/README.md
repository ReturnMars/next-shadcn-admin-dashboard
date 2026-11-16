# World Atlas 地图数据

保留上游模板使用的 countries-110m 地图，随物流页面打包，避免运行时依赖 CDN。

- 来源：[topojson/world-atlas](https://github.com/topojson/world-atlas)，npm `world-atlas@2.0.2` 的 `countries-110m.json`
- 数据来自 Natural Earth 4.1.0；包内 ISC 许可见相邻 LICENSE
- 原文件 SHA-256：`2516c915867c7baf18ddec727aec46c315541a07cfb3d79a6559b05d5e94eee8`
- `world-atlas.ts` 在模块边界校验数据，再生成陆地和国界几何；不执行外部请求。
