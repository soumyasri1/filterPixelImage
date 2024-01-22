import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ImageGallery.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAllMetadata, setShowAllMetadata] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const storedImage = JSON.parse(localStorage.getItem('selectedImage'));
    if (storedImage && images.some(image => image.preview === storedImage.preview)) {
      setSelectedImage(storedImage);
    } else if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/images');
      if (response.status === 200) {
        const imageData = response.data;
        console.log('Fetched images:', imageData);
        setImages(imageData);
      } else {
        console.error('Error fetching images');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowAllMetadata(false);
  };

  const handleLoadMoreClick = () => {
    setShowAllMetadata(!showAllMetadata);
  };

  const handleDownloadClick = async () => {
    if (selectedImage) {
      try {
        const response = await fetch(`http://localhost:8000/images/${selectedImage.preview}`);
        const blob = await response.blob();

        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = selectedImage.fileName;
        downloadLink.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">Image Gallery</h1>
      <div className="gallery-thumbnails">
        {images.map((image, index) => (
          <div
            key={index}
            className={`thumbnail ${image === selectedImage ? 'selected' : ''}`}
            onClick={() => handleImageClick(image)}
          >
            <img src={`http://localhost:8000/images/${image.preview}`} alt="" />
          </div>
        ))}
      </div>
      <div className="main-view">
        {selectedImage && (
          <div className="selected-card">
            <div className="card-img-wrapper">
              <img
                src={`http://localhost:8000/images/${selectedImage.preview}`}
                alt=""
                className="card-img"
              />
            </div>
            <div className="card-details">
              <h3 className="card-title">{selectedImage.fileName}</h3>
              <ul className="metadata">
                <li>Aperture: {selectedImage.metadata.Aperture}</li>
                <li>File Size: {selectedImage.fileSize} bytes</li>
                <li>Lens Type: {selectedImage.metadata.LensType}</li>
                <li>Contrast: {selectedImage.metadata.Contrast}</li>
                <li>Scene Capture Type: {selectedImage.metadata.SceneCaptureType}</li>
                <li>White Balance: {selectedImage.metadata.WhiteBalance}</li>
                <li>Shutter Speed: {selectedImage.metadata.ShutterSpeed}</li>
                <li>ISO: {selectedImage.metadata.ISO}</li>
                {showAllMetadata &&
                  Object.entries(selectedImage.metadata).map(([key, value]) => (
                    <li key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {JSON.stringify(value)}
                    </li>
                  ))}
              </ul>
              <div className="button-group">
                <button className="load-more-btn" onClick={handleLoadMoreClick}>
                  {showAllMetadata ? 'Show Less' : 'Load More'}
                </button>
                <button className="download-btn" onClick={handleDownloadClick}>
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
