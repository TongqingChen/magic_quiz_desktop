const { contextBridge } = require('electron');

// 桌面壳里统一字体与抗锯齿，避免与浏览器渲染差异。
window.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
    body, button, input, textarea, select {
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB",
        "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
    }
  `;
  document.head.appendChild(style);
});

// 暴露一个最小的桌面标识，页面可据此隐藏“下载客户端”等入口。
contextBridge.exposeInMainWorld('mqDesktop', {
  platform: process.platform,
  version: process.versions.electron,
});
