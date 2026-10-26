# 学海桌面端（Electron）

Windows / macOS 桌面客户端，加载线上 H5（https://docs.tsinghua-wx.org/app/），与 Web、小程序共用同一套界面与数据。

## 开发

```bash
npm install
npm run dev
```

可用环境变量：

- `MQ_APP_URL`：覆盖加载地址（默认线上 `/app/`）
- `MQ_USE_LOCAL=1`：加载本地 `renderer/index.html`（离线包场景）

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

- macOS：未签名/未公证时首次打开需右键「打开」；正式分发需 Apple Developer 账号 + notarize；
- Windows：未签名会被 SmartScreen 拦截；正式分发建议 OV/EV 代码签名证书。

## 发布

安装包上传至 Gitee 发行版（`v<ver>-desktop`），再更新 `magic_quiz_downloads/releases.json` 的 `platforms.windows` / `platforms.mac`，下载页会自动生效。
