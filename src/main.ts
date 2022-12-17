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
		// Someone tried to run a second instance, we should focus our window.
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});

	// Create mainWindow, load the rest of the app, etc...
	app.whenReady().then(() => {
		createWindow();
	});

	// Handle the protocol. In this case, we choose to show an Error Box.
	app.on("open-url", (event, url) => {
		dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
	});
}

app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
