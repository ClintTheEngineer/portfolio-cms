import { useState } from 'react';
import PropTypes from 'prop-types';
import { LogoutButton } from './LogoutButton';
import { useNavigate } from "react-router";

export const ImageForm = ({ onSubmit }) => {
  const [liveSiteLink, setLiveSiteLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState([]);

  const token = localStorage.getItem('token');
  const navigate = useNavigate;

if (!token) navigate("/");


ImageForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = (event) => {
        uploadedImages.push(event.target.result);
        if (uploadedImages.length === files.length) {
          setImages([...images, ...uploadedImages]);
        }
      };

      reader.readAsDataURL(files[i]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      siteLink: liveSiteLink,
      githubLink: githubLink,
      caption: caption,
      image_data: images
    };

    try {
      const response = await fetch('http://localhost:5000/project-add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      //const data = await response.json();
  
      onSubmit({ liveSiteLink, githubLink, caption, images });
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      // Handle error state, complete this later
    }
  };

  return (
    <>
    <div id='container'>
    <div className="drop-zone" style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
      <form onSubmit={handleFormSubmit}>
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

export const ImageBank = () => {
  const [formsData, setFormsData] = useState([...Array(6)].map(() => ({
    liveSiteLink: '',
    githubLink: '',
    caption: '',
    images: [],
  })));
  const username = localStorage.getItem('username');

  const handleFormSubmit = (formData, index) => {
    // Handle form submission logic here with formData (liveSiteLink, githubLink, caption, and images)
    console.log(`Form ${index + 1} submitted:`, formData);

    // Optionally, reset the form fields and image state after submission
    const updatedFormsData = [...formsData];
    updatedFormsData[index] = {
      liveSiteLink: '',
      githubLink: '',
      caption: '',
      images: [],
    };
    setFormsData(updatedFormsData);
  };

  return (
    <>
    <nav>Welcome, {username.toUpperCase()}</nav>
      {formsData.map((formData, index) => (
        <ImageForm key={index} index={index} onSubmit={(data) => handleFormSubmit(data, index)} />
      ))}
      <LogoutButton />
    </>
  );
};



