const {dialog, BrowserWindow, ipcMain} = require('electron');
const {autoUpdater} = require('electron-updater');

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.autoDownload = false;

exports.check = () => {
    autoUpdater.checkForUpdates();

    autoUpdater.on('update-availagble', () => {
        let downloadProgress = 0;

        dialog.showMessageBox({
            type: 'info',
            title: 'Update Available',
            message: 'A new version of Mockitalki is available. Do you want to update now?',
            buttons: ['Update', 'No']
        }, (buttonIndex) => {
            if (buttonIndex !== 0) return;

            autoUpdater.downloadUpdate();
            autoUpdater.on('download-progress', (d) => {
                downloadProgress = d.percent;

                let progressWin = new BrowserWindow({
                    width: 350,
                    height: 35,
                    useContentSize: true,
                    autoHideMenuBar: true,
                    maximizable: false,
                    fullscreen: false,
                    fullscreenable: false,
                    resizable: false
                });

                progressWin.loadFile('renderer/progress.html');

                progressWin.on('closed', () => {
                    progressWin = null;
                });

                ipcMain.on('download-progress-request', (e) => {
                    e.returnValue = downloadProgress;
                });

                autoUpdater.logger.info(downloadProgress);

                autoUpdater.on('update-downloaded', () => {
                    if(progressWin) progressWin.close();

                    dialog.showMessageBox({
                        type: 'info',
                        title: 'Update Ready',
                        message: 'A new version of Mockitalki is ready. Quit and install now?',
                        buttons: ['Yes', 'Later']
                    }, (buttonIndex) => {
                        if(buttonIndex === 0) autoUpdater.quitAndInstall();
                    })
                });
            })
        });
    });
}
