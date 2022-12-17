import { app, BrowserWindow, dialog } from "electron";
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
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, "preload.js"),
		},
		width: 800,
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "../dist/", "index.html"));

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
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
