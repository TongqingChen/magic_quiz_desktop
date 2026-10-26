const { app, BrowserWindow, shell, Menu, nativeTheme } = require('electron');
const path = require('node:path');

// 远端优先：桌面端始终加载线上最新 H5，避免每次发版都重新分发包。
const APP_URL = process.env.MQ_APP_URL || 'https://docs.tsinghua-wx.org/app/';
const LOCAL_INDEX = path.join(__dirname, '..', 'renderer', 'index.html');
const useLocal = process.env.MQ_USE_LOCAL === '1';

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    title: '学海',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#111827' : '#f4f7fb',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());

  // 站外链接一律交给系统浏览器，避免在应用内打开广告/无关页面。
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const allowed = useLocal ? url.startsWith('file://') : url.startsWith(new URL(APP_URL).origin);
    if (!allowed) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  if (useLocal) {
    mainWindow.loadFile(LOCAL_INDEX);
  } else {
    mainWindow.loadURL(APP_URL);
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
