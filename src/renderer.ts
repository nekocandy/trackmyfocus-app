// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
	bridge: any;
}

console.log("hello from");

window.bridge.setToken((event: any, token: string) => {
	console.log({ event, token });
	const params = new URLSearchParams(token);

	console.log(params);
});
