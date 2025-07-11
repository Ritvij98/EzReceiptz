const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  showDialog: () => ipcRenderer.invoke("show-dialog"),
  filesDrop: (filePaths) => ipcRenderer.invoke("files-drop", filePaths),
  performOCR: () => ipcRenderer.send("perform-ocr"),
  uploadToSheet: () => ipcRenderer.send("upload-to-sheet"),
  makeStreamingRequest: (element, callback) => {
    const { port1, port2 } = new MessageChannel();
    ipcRenderer.postMessage('give-me-a-stream', { element, count: 10 }, [port2]);

    port1.onmessage = (event) => {
      callback(event.data);
    };
    port1.onclose = () => {};
  }
});
