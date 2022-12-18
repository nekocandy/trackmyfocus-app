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
        height: 100,
        minWidth: 400,
        maxWidth: 400,
        resizable: false,
        minimizable: false,
        // autoHideMenuBar: true,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js")
        }
    });
    mainWindow.loadURL("file://".concat(path.join(__dirname, "../dist/index.html")));
    mainWindow.setAlwaysOnTop(true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mainWindow.webContents.setWindowOpenHandler(function (_a) {
        var url = _a.url;
        electron_1.shell.openExternal(url);
        return { action: 'deny' };
    });
}
var gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    electron_1.app.quit();
}
else {
    electron_1.app.on("second-instance", function (event, commandLine) {
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
// app.on("open-url", (event, url) => {
// 	event.preventDefault();
// 	console.log("open-url event: " + url);
// 	dialog.showErrorBox("open-url", `You arrived from: ${url}`);
// });
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map