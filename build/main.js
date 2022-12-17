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
            nodeIntegration: true,
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
        if (mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
        }
        if (commandLine.length > 1) {
            // Only try this if there is an argv (might be redundant)
            if (process.platform == "win32" || process.platform === "linux") {
                try {
                    console.log("Direct link to file - SUCCESS: ".concat(commandLine[commandLine.length - 1]));
                    mainWindow.webContents.send("setToken", commandLine[commandLine.length - 1]);
                    mainWindow.webContents.send("send-share-link", {
                        targetLink: commandLine[commandLine.length - 1].split("trackmyfocus://")[1]
                    });
                }
                catch (_a) {
                    console.log("Direct link to file - FAILED: ".concat(commandLine));
                }
            }
        }
    });
    // Create mainWindow, load the rest of the app, etc...
    electron_1.app.whenReady().then(function () {
        electron_1.app.on("activate", function () {
            if (electron_1.BrowserWindow.getAllWindows().length === 0)
                createWindow();
        });
        createWindow();
    });
}
// Handle the protocol. In this case, we choose to show an Error Box.
electron_1.app.on("open-url", function (event, url) {
    event.preventDefault();
    console.log("open-url event: " + url);
    electron_1.dialog.showErrorBox("open-url", "You arrived from: ".concat(url));
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map