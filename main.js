const { app, BrowserWindow,BrowserView, dialog, ipcMain, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const { createWorker } = require("tesseract.js");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const pdf = require("pdf-poppler");
let pdfPaths;
let recognisedInfo = [];

const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

function convertAndMove() {
  async function pdfToImageConverter(file) {
    let fileBasename = path.basename(file, path.extname(file));
    let opts = {
      format: "png",
      out_dir: path.dirname("./images/__file__"),
      out_prefix: fileBasename,
      page: 1,
    };
    await pdf
      .convert(file, opts)
      .then((res) => {
      })
      .catch((error) => {
        console.error(error);
      });
  }

  if (pdfPaths) {
    pdfPaths.map((pdfPath) => {
      fs.readFile(pdfPath, { encoding: "utf-8" }, function (err, data) {
        if (!err) {
          pdfToImageConverter(pdfPath);
        } else {
        }
      });
    });
  }
}

function dragDroppedFiles(event, filePaths) {
  pdfPaths = filePaths;
  convertAndMove();
  return filePaths.length;
}

async function handleDialogDisplay(event) {
  if (process.platform !== "darwin") {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Select the File(s) to be uploaded",
      defaultPath: path.join(__dirname, "../../.."),
      buttonLabel: "Upload",
      filters: [
        {
          name: "PDFs",
          extensions: ["pdf"],
        },
      ],
      properties: ["openFile", "multiSelections"],
    });
    if (!canceled) {
      pdfPaths = filePaths.map((path) => path.toString());
      convertAndMove();
      return filePaths.length;
    } else {
      return 0;
    }
  } else {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Select the File to be uploaded",
      defaultPath: path.join(__dirname, "../../.."),
      buttonLabel: "Upload",
      filters: [
        {
          name: "PDFs",
          extensions: ["pdf"],
        },
      ],
      properties: ["openFile", "multiSelections"],
    });

    if (!canceled) {
      pdfPaths = filePaths.map((path) => path.toString());
      convertAndMove();
      return filePaths.length;
    } else {
      return 0;
    }
  }
}

function performOCR(event, msg) {
  const [replyPort] = event.ports;

  fs.readdir(path.dirname("./images/__file__"), function (err, files) {
    if (err) {
      return;
    }
    files.forEach(async function (file) {
      function textFormatter(text) {
        let textLines = text.split("\n");
        let recognisedInfoObject = {
          date: "",
          receiptNo: "",
          name: "",
          emailID: "",
          mobile: "",
          dated: "",
          amount: "",
        };
        recognisedInfoObject.receiptNo = textLines[2].split(": ")[1];
        recognisedInfoObject.name = textLines[4].split("from ")[1].split(",")[0];
        let a = textLines[13].search("dated");
        recognisedInfoObject.dated = textLines[13].slice(a + 6, a + 17);
        recognisedInfoObject.amount = textLines[10].split(" ")[1];
        return recognisedInfoObject;
      }
      const worker = createWorker({
        logger: (m) => {
          replyPort.postMessage(m);
        },
      });

      async function ocr() {
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const {
          data: { text },
        } = await worker.recognize(path.join(__dirname, ".", "images", file));
        await worker.terminate();
        replyPort.close();
        return textFormatter(text);
      }
      let result = await ocr();
      recognisedInfo.push(result);
    });
  });
}
async function uploadToSheet() {
  /**
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async function loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async function saveCredentials(client) {
    const content = await fs.readFileSync(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFileSync(TOKEN_PATH, payload);
  }

  /**
   * Load or request or authorization to call APIs.
   *
   */
  async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  async function infoUpload(auth, finalInfo) {
    let values=[];
    try {
      const sheets = google.sheets({ version: "v4", auth });
      finalInfo.map((x)=>values.push([x.receiptNo,x.name,x.amount,"",x.dated]))
      const resource = {
        values,
      }
      const res = await sheets.spreadsheets.values.append({
        spreadsheetId: "1WPDakj6pwwEAWKecnnYf42UTNztNAU56DRNA8XzjAHw",
        range: "G09!A1:E5",
        valueInputOption: "RAW",
        insertDataOption: 'INSERT_ROWS',
        resource,
      });
      const rows = res.data.values;
      if (!rows || rows.length === 0) {
        return;
      }

      rows.forEach((row) => {
      });
    } catch (err) {
      return null;
    }
  }
  try {
    const client = await authorize();
    infoUpload(client, recognisedInfo);
  } catch (err) {
    return null;
  }
}
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const child = new BrowserWindow({ parent: win, modal: true, show: false })
  child.loadURL('https://github.com')

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => child.show() ,
          label: 'Increment',
        },
        {
          click: () => win.webContents.send('update-counter', -1),
          label: 'Decrement',
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  ipcMain.handle("show-dialog", handleDialogDisplay);
  ipcMain.handle("files-drop", dragDroppedFiles);
  ipcMain.on("upload-to-sheet", uploadToSheet);
  ipcMain.on("give-me-a-stream", performOCR);
  win.loadFile("./scr/index.html");
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
