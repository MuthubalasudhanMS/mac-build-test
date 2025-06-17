const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const remoteMain = require('@electron/remote/main');
const log = require('electron-log');
remoteMain.initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: true,
    },
  });

  remoteMain.enable(win.webContents);
  win.loadFile('index.html');

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('app-version', app.getVersion());
  });
}

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

app.on('ready', () => {
  createWindow();

    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = "info";

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = false; // Set to true for silent quit & install
  autoUpdater.allowPrerelease = true;

  log.info("Logging test: App is ready.");

  // // 🔧 Tell electron-updater where to look for updates
  // autoUpdater.setFeedURL({
  //   provider: 'generic',
  //   url: 'https://dev-users-asset.s3.us-east-1.amazonaws.com/Application-Builds/'  
  // });

  // Start checking for updates
    autoUpdater.checkForUpdates();
  // autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
  });

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({ message: 'Update available. Downloading...' });
  });


    autoUpdater.on('update-downloaded', () => {
      const isLinux = process.platform === 'linux';

      if (isLinux) {
        dialog.showMessageBox({
          type: 'info',
          title: 'Update Ready',
          message: 'Update downloaded. Restart now?',
          buttons: ['Restart', 'Later']
        }).then((result) => {
          if (result.response === 0) {
            autoUpdater.quitAndInstall();
          }
        });
      }else{
        autoUpdater.quitAndInstall();
      }
    });

    autoUpdater.on('error', (error) => {
      console.error('Auto updater error:', error);
    });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

console.log("Running version", app.getVersion());

// For building the Windows dist(replaced in dist key inside package.json)
// "dist": "electron-builder --win --x64"

//For locally sharing files using http server
      // {
      //   "provider": "generic",
      //   "url": "http://127.0.0.1:5000/"
      // }

// DEV Browser Upload S3
// https://dev-users-asset.s3.us-east-1.amazonaws.com/Application-Builds/

//Path for log file
//C:\Users\MuthuBalaSudhanMahal\AppData\Roaming\my-electron-app\logs>