import { useState } from 'react';
import PropTypes from 'prop-types';

export const ImageForm = ({ onSubmit }) => {
  const [liveSiteLink, setLiveSiteLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState([]);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ liveSiteLink, githubLink, caption, images });
  };

  return (
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
  );
};

export const ImageBank = () => {
  const [formsData, setFormsData] = useState([...Array(6)].map(() => ({
    liveSiteLink: '',
    githubLink: '',
    caption: '',
    images: [],
  })));

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
      {formsData.map((formData, index) => (
        <ImageForm key={index} index={index} onSubmit={(data) => handleFormSubmit(data, index)} />
      ))}
    </>
  );
};



