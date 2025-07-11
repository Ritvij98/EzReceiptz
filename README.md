<img width="1887" height="262" alt="image" src="https://github.com/user-attachments/assets/11e640d1-0e40-4bff-86d0-248b66bfb15b" />
# EzReceiptz

EzReceiptz is a desktop application built with [Electron](https://electronjs.org/) that extracts data from receipt files using OCR and uploads the information to a Google Sheet. The interface lets you drag and drop PDF or PNG receipts, run OCR with Tesseract.js, and then send the recognized data directly to a spreadsheet.

## Features

- Drag-and-drop or select receipt files (PDF/PNG).
- Performs optical character recognition (OCR) using Tesseract.js.
- Uploads parsed receipt data (receipt number, name, amount, date) to a Google Sheet via the Google Sheets API.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- A Google Cloud project with Sheets API enabled and OAuth credentials.

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EzReciptz-
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Google API credentials**
   - Place your OAuth client credentials file as `credentials.json` in the project root.
   - The first run will prompt you to authorize and will create `token.json`.
   - If you want to re-authenticate, delete `token.json` before running again.

## Development

Run the application in development mode with Electron:
```bash
npm start
```
Electron will open a window with the EzReceiptz interface.

## Packaging & Distribution

1. **Set up Electron Forge** (only required once):
   ```bash
   npm install --save-dev @electron-forge/cli
   npx electron-forge import
   ```
   The import step adds `package` and `make` scripts to your project.
2. **Package the application** – this builds the app into the `out` directory:
   ```bash
   npm run package
   ```
3. **Create installers** – generates platform-specific installers in the `out` directory:
   ```bash
   npm run make
   ```

## Usage

1. **Upload receipts**
   - Drag PDF/PNG files onto the drop area or click **Choose a file** to select them. The app will display how many files were uploaded.
2. **Run OCR**
   - Click the **OCR** button to process the uploaded receipts. Progress will be shown next to the button.
3. **Upload to Google Sheet**
   - After OCR is complete, click **Upload Info** to append the recognized data to your spreadsheet. The sheet ID and range can be changed in `main.js`.

## Notes

- The repository includes the English `eng.traineddata` file for Tesseract.
- Customize the target `spreadsheetId` and cell range in [`main.js`](main.js) to use your own spreadsheet.

## Screenshots

| Step | Image |
|------|-------|
| Application main window | ![Main window](<img width="1482" height="999" alt="image" src="https://github.com/user-attachments/assets/e95b0159-db96-4a57-b420-2b6c37bff213" />
) |
| Drag & drop receipts | ![Drag and drop](<img width="1558" height="472" alt="image" src="https://github.com/user-attachments/assets/f662f248-9b9c-4d1e-8b9c-77d3ba4d244d" />
) |
| OCR progress | ![OCR progress](<img width="1542" height="237" alt="image" src="https://github.com/user-attachments/assets/76afa3e0-b156-4eee-8f65-19250b8facaa" />
) |
| Upload to Google Sheets | ![Upload](<img width="1887" height="262" alt="image" src="https://github.com/user-attachments/assets/df725cb6-3682-47b8-a97e-8e9bfe0d2301" />
) |
