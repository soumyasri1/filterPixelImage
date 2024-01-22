# Image Processing App
This project comprises a server and a React client designed for image processing and presentation. The server is constructed using Node.js with the Express framework, while the client is a React application. For handling file uploads, the server integrates the multer middleware, employs the exiftool-vendored library for extracting image metadata, and utilizes the axios library to facilitate HTTP requests from the client.
Server (Node.js)
Dependencies
express: A web application framework for Node.js.
multer: Middleware for handling multipart/form-data, primarily used for file uploads.
fs: Node.js module for file system operations.
cors: Middleware to enable Cross-Origin Resource Sharing.
exiftool-vendored: A Node.js wrapper for the ExifTool library, used for reading image metadata.
path: Node.js module for working with file paths.
Setup
# Install dependencies:
npm install
# Run the server:
npm start

The server will be accessible at http://localhost:8000.

Endpoints
POST /upload: Handles file uploads. Images are saved, previews are extracted, and metadata is read and stored.

GET /images: Retrieves information about processed images.

Usage
Upload images using the /upload endpoint.
Retrieve processed images using the /images endpoint.

# Client (React)
Dependencies
react: JavaScript library for building user interfaces.
axios: A promise-based HTTP client for making requests.
Setup
Install dependencies:
npm install
Run the React app:

npm start
The app will be accessible at http://localhost:3000.

Features
Displays a gallery of images with thumbnails.
Clicking on a thumbnail shows details about the selected image, including metadata.
Load more button toggles between displaying a subset or all metadata.
Download button allows downloading the selected image.
Notes
The client assumes the server is running at http://localhost:8000.

Image previews and processed images are stored in the /images directory.

HOW TO RUN:
1. go to backend folder
2. npm install
3. npm start
4. We have to upload images from postman as currently is stored in local storage - POST - http://localhost:8000/upload
5. all data are saved to images folder
6. You can see all info from http://localhost:8000/images using GET

7.Go to frontend Folder
8.npm install
9.npm run dev
10.Project starts from localhost:3000
