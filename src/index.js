const fileCount = document.getElementById('fileCount');

// Drag and drop file upload
const dropBox = document.getElementById('drop-box');
dropBox.addEventListener('drop', async (event) => {
        let filePaths = [];
        event.preventDefault();
        event.stopPropagation();

        for (const f of event.dataTransfer.files) {
                // Use the path attribute to get absolute file path
                filePaths.push(f.path.toString());
        }
        const countResult = await electronAPI.filesDrop(filePaths);
        fileCount.innerText = countResult;
});

dropBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
});

dropBox.addEventListener('dragenter', (event) => {
        // File entered drop zone
});

dropBox.addEventListener('dragleave', (event) => {
        // File left drop zone
});

// Manual file selection
const uploadFile = document.getElementById('upload');
uploadFile.addEventListener('click', async () => {
        const countResult  = await electronAPI.showDialog();
        fileCount.innerText = countResult;
});

// OCR
const performOCRButton = document.getElementById('ocr');
const ocrProgress = document.getElementById('ocrProgress');
performOCRButton.addEventListener('click', () => {
        electronAPI.makeStreamingRequest(42, (data) => {
        ocrProgress.innerText = data.progress.toFixed(3) * 100 + '%';
  })
});

// Upload OCR result to Google Sheet
const uploadToSheetButton = document.getElementById('upload-to-sheet');
uploadToSheetButton.addEventListener('click', () => {
        electronAPI.uploadToSheet();
});