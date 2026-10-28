# 学海桌面端（Electron）

Windows / macOS 桌面客户端，加载线上 Web 版（https://docs.tsinghua-wx.org/，桌面布局），与 Web、小程序共用同一套界面与数据。

## 开发

```bash
npm install
npm run dev
```

可用环境变量：

- `MQ_APP_URL`：覆盖加载地址（默认线上 Web 版根路径）
- `MQ_USE_LOCAL=1`：加载本地 `renderer/index.html`（离线包场景）

## 为什么加载 Web 版而不是 H5

Web 版（`https://docs.tsinghua-wx.org/`）是面向大屏的桌面布局（侧边导航、宽表格、多列卡片），
H5（`/app/`）是移动端底部 Tab 布局，放进 1280×860 的桌面窗口会显得空旷、导航层级也不一致。
两者接口完全一致，因此桌面端默认加载 Web 版即可，无需每次发版重新打包。

如果要做**离线安装包**，把 `mq_frontend/dist` 复制到 `renderer/` 后设置 `MQ_USE_LOCAL=1` 即可，
但每次 Web 发版都要重新打包分发，成本更高，所以默认仍是「远端优先 + 加载 Web 版」。

## 打包

```bash
npm run dist:mac     # 产出 dmg（arm64 + x64）
npm run dist:win     # 产出 nsis 安装包 + portable
npm run dist:dir     # 只产出未打包目录，用于快速验证
```

首次打包若 Electron 下载失败，可手动下载并解压后指定：

```bash
npx electron-builder --mac -c.electronDist=/path/to/electron-dist
```

## 产物

| 平台 | 文件 |
|---|---|
| macOS (Apple Silicon) | `release/magic-quiz-<ver>-mac-arm64.dmg` |
| macOS (Intel) | `release/magic-quiz-<ver>-mac-x64.dmg` |
| Windows 安装版 | `release/magic-quiz-<ver>-win-setup.exe` |
| Windows 免安装 | `release/magic-quiz-<ver>-win-portable.exe` |

## 签名说明

- macOS：构建后用 `scripts/after-pack.js` 做 **ad-hoc 签名**（`codesign --force --deep --sign -`）。
  没有这一步时 Apple Silicon 会把只带 linker 签名的包判定为「已损坏，无法打开」；
  ad-hoc 签名后系统只会提示「无法验证开发者」，右键 →「打开」或
  `xattr -dr com.apple.quarantine /Applications/学海.app` 即可运行。
  要彻底去掉提示，需要 Apple Developer ID 证书 + notarize（付费账号）。
- Windows：未签名会被 SmartScreen 拦截；正式分发建议 OV/EV 代码签名证书。

## DMG 压缩

`build.dmg.format` 固定为 `UDBZ`（bzip2）。默认压缩下 x64 包会超过 Gitee 单个附件
100 MB 的上限（实测签名后 100.1 MiB 被拒），UDBZ 可把包体压到 ~86 / ~91 MiB。

## 发布

安装包上传至 Gitee 发行版（`v<ver>-desktop`），再更新 `magic_quiz_downloads/releases.json` 的 `platforms.windows` / `platforms.mac`，下载页会自动生效。
