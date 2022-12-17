import { app, BrowserWindow, dialog } from "electron";
import * as isDev from "electron-is-dev";
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
		autoHideMenuBar: true,
		alwaysOnTop: true,
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, "preload.js"),
		},
		width: 800,
	});

	mainWindow.loadURL(
		isDev
			? "http://localhost:5173"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);

	// Open the DevTools.
	mainWindow.webContents.openDevTools({
		mode: "undocked",
	});
	mainWindow.setAlwaysOnTop(true);
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	app.quit();
} else {
	app.on("second-instance", (event, commandLine, workingDirectory) => {
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
app.on("open-url", (event, url) => {
	event.preventDefault();
	console.log("open-url event: " + url);

	dialog.showErrorBox("open-url", `You arrived from: ${url}`);
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
