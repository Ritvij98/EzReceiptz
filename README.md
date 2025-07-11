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
| Application main window | ![Main window](https://github.com/user-attachments/assets/e5804ccf-82bb-4d47-b1d0-04fe863cc00b) |
| Drag & drop receipts | ![Drag and drop](https://github.com/user-attachments/assets/9fdabc39-dd8a-488a-86ea-6dea5d75562c) |
| OCR progress | ![OCR progress](https://github.com/user-attachments/assets/74669214-db6d-4f4a-b50c-4cbd241a5e5c) |
| Upload to Google Sheets | ![Upload](https://github.com/user-attachments/assets/eb7fd526-ec93-48c6-b085-6dd9f49949af) |
