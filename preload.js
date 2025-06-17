// window.addEventListener('DOMContentLoaded', () => {
//   console.log('App is loaded');
// });

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  app: () => ipcRenderer.invoke('get-app-version'),
});

