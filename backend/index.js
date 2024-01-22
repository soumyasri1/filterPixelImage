const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const { ExifTool } = require('exiftool-vendored');
const path = require('path'); // Import 'path' module for working with file paths

const app = express();
const port = 8000;
app.use(cors());

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage for handling files in memory
const upload = multer({ storage: storage });

// Create an instance of ExifTool
const exiftool = new ExifTool();

// Array to store information about processed images
const processedImages = [];

// Define a function to read image metadata
async function readImageMetadata(filePath) {
try {
const metadata = await exiftool.read(filePath, ['-File:all']);
console.log('Image Metadata:', metadata);
} catch (error) {
console.error('Error reading image metadata:', error);
}
}

// Define a function to extract a preview image
async function extractPreview(imageFile, previewFile) {
try {
console.log('Extracting preview for file:', imageFile);

// Log the file size before extraction
const fileSizeBefore = fs.statSync(imageFile).size;
console.log('File size before extraction:', fileSizeBefore, 'bytes');

// Extract the preview image
await exiftool.extractPreview(imageFile, previewFile);

// Log the file size after extraction
const fileSizeAfter = fs.statSync(previewFile).size;
console.log('File size after extraction:', fileSizeAfter, 'bytes');

console.log('Preview image extracted:', previewFile);
} catch (error) {
console.error('Error extracting preview image:', error);
}
}

// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Update the route handler for handling file uploads
app.post('/upload', upload.any('image'), async (req, res) => {
try {
// Loop through each uploaded file
for (const file of req.files) {
const imagePath = `uploaded_${file.originalname}`;
const previewImagePath = `preview_${file.originalname}.jpg`;

// Save the uploaded image
fs.writeFileSync(imagePath, file.buffer);

// Extract and save the preview image
await extractPreview(imagePath, path.join(__dirname, 'images', previewImagePath));

// Read image metadata
const metadata = await exiftool.read(imagePath, ['-File:all']);
console.log('Image Metadata:', metadata);

// Store information about processed image
processedImages.push({
image: imagePath,
preview: previewImagePath,
fileName: file.originalname,
fileSize: file.size,
metadata: metadata,
});

console.log(processedImages);
console.log(previewImagePath);
}

res.status(200).send('Images processed successfully');
} catch (error) {
console.error('Error processing image:', error);
res.status(500).send('Error processing image');
}
});


// Route handler for retrieving processed images
app.get('/images', (req, res) => {
res.status(200).json(processedImages);
});

app.listen(port, () => {
console.log(`Server is running at http://localhost:${port}`);
});