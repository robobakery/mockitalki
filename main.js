// Modules to control application life and create native browser window
const {app} = require('electron')
const mainWindow = require('./mainWindow');

const updater = require('./updater');

// if (process.env.NODE_ENV !== 'production') {
//   require('electron-reload')(__dirname);
// }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  mainWindow.createWindow()

  setTimeout(updater.check, 2000);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) mainWindow.createWindow()
})
