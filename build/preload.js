"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", function () {
    var replaceText = function (selector, text) {
        var element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    };
    for (var _i = 0, _a = ["chrome", "node", "electron"]; _i < _a.length; _i++) {
        var type = _a[_i];
        replaceText("".concat(type, "-version"), process.versions[type]);
    }
});
electron_1.contextBridge.exposeInMainWorld("bridge", {
    setToken: function (listener) {
        electron_1.ipcRenderer.on("setToken", listener);
    }
});
//# sourceMappingURL=preload.js.map