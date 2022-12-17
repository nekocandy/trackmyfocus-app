"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
if (process.defaultApp) {
    electron_1.app.setAsDefaultProtocolClient("trackmyfocus", process.execPath, [
        path.resolve(process.argv[1]),
    ]);
}
else {
    electron_1.app.setAsDefaultProtocolClient("trackmyfocus");
}
var mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        width: 800
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../dist/", "index.html"));
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}
var gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    electron_1.app.quit();
}
else {
    electron_1.app.on("second-instance", function (event, commandLine, workingDirectory) {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
        }
    });
    // Create mainWindow, load the rest of the app, etc...
    electron_1.app.whenReady().then(function () {
        createWindow();
    });
    // Handle the protocol. In this case, we choose to show an Error Box.
    electron_1.app.on("open-url", function (event, url) {
        electron_1.dialog.showErrorBox("Welcome Back", "You arrived from: ".concat(url));
    });
}
electron_1.app.whenReady().then(function () {
    createWindow();
    electron_1.app.on("activate", function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map