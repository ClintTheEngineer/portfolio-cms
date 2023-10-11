import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router";

export const PortfolioEditor = ({ onSubmit }) => {
  const [liveSiteLink, setLiveSiteLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [caption, setCaption] = useState('');
  const [images] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedId, setSelectedId] = useState(1);

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const optionsTotal = 6;

if (!token) navigate("/");

PortfolioEditor.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

const handleImageUpload = (e) => {
  const files = e.target.files;
  const uploadedImages = [];

  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();

    reader.onload = (e) => {
      uploadedImages.push(e.target.result);

      if (uploadedImages.length === files.length) {
        setUploadedImages(uploadedImages);
      }
    };

    reader.readAsDataURL(files[i]);
  }
};


// Helper function to convert data URI to Blob
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/png' });
}

  

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', selectedId)
    formData.append('siteLink', liveSiteLink);
    formData.append('githubLink', githubLink);
    formData.append('caption', caption);
    formData.append('username', username);

    // Append uploaded images to the form data
    for (let i = 0; i < uploadedImages.length; i++) {
      const dataURL = uploadedImages[i];
      formData.append('image', dataURItoBlob(dataURL), `${username}_image_${selectedId}.png`);
    }
    
    try {
      const response = await fetch('http://localhost:5000/project-add', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      onSubmit(data);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  return (
    <>
    <div id='container'>
    <div className="drop-zone" style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
      <form onSubmit={handleFormSubmit}>
      <p>
              Project ID:{" "}
              <select value={selectedId} onChange={(e) => setSelectedId(parseInt(e.target.value))}>
                {[...Array(optionsTotal).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
            </p>
        <p>Live site link: <input type='text' onChange={(e) => setLiveSiteLink(e.target.value)} /></p>
        <p>GitHub link: <input type='text' onChange={(e) => setGithubLink(e.target.value)} /></p>
        <p>Caption: <input type='text' onChange={(e) => setCaption(e.target.value)} /></p>
        <input type="file" accept="image/*" onChange={handleImageUpload} multiple />
        <h2>Or</h2>
        <p>Drag & drop images here</p>

        {images.map((image, imgIndex) => (
          <img key={imgIndex} src={image} alt={`uploaded-${imgIndex}`} style={{ maxWidth: '100px', margin: '10px' }} />
        ))}

        <button type='submit'>Submit</button>
      </form>
    </div>
    </div>
    </>
  );
};