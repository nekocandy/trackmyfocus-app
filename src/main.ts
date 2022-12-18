import { app, BrowserWindow, dialog, shell } from "electron";
import * as path from "path";

if (process.defaultApp) {
	app.setAsDefaultProtocolClient("trackmyfocus", process.execPath, [
		path.resolve(process.argv[1]),
	]);
} else {
	app.setAsDefaultProtocolClient("trackmyfocus");
}

let mainWindow: BrowserWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		height: 100,
		minWidth: 400,
		maxWidth: 400,
		resizable: false,
		minimizable: false,
		// autoHideMenuBar: true,
		alwaysOnTop: true,
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, "preload.js"),
		},
	});

	mainWindow.loadURL(`file://${path.join(__dirname, "../dist/index.html")}`);
	mainWindow.setAlwaysOnTop(true);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: 'deny' };
	});
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	app.quit();
} else {
	app.on("second-instance", (event, commandLine: string[]) => {
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}

		if (commandLine.length > 1) {
			// Only try this if there is an argv (might be redundant)
			if (process.platform == "win32" || process.platform === "linux") {
				try {
					console.log(
						`Direct link to file - SUCCESS: ${
							commandLine[commandLine.length - 1]
						}`
					);

					mainWindow.webContents.send(
						"setToken",
						commandLine[commandLine.length - 1]
					);

					mainWindow.webContents.send("send-share-link", {
						targetLink:
							commandLine[commandLine.length - 1].split("trackmyfocus://")[1],
					});
				} catch {
					console.log(`Direct link to file - FAILED: ${commandLine}`);
				}
			}
		}
	});

	// Create mainWindow, load the rest of the app, etc...
	app.whenReady().then(() => {
		app.on("activate", function () {
			if (BrowserWindow.getAllWindows().length === 0) createWindow();
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

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
