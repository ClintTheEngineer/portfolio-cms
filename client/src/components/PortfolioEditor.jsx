import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router";
import { Constants } from './Constants';

export const PortfolioEditor = ({ onSubmit }) => {
  const [liveSiteLink, setLiveSiteLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState([]);
  const [selectedId, setSelectedId] = useState(1);

  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const optionsTotal = 6;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

PortfolioEditor.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

const handleImageChange = (e) => {
  const selectedImage = e.target.files[0];
  setImage(selectedImage);
};
 

  const handleFormSubmit = async (e) => {
  e.preventDefault();

  if (!username || !selectedId || !image || !liveSiteLink || !githubLink || !caption) {
    console.error('Required data is missing');
    return;
  }

 const formData = new FormData();
 const filename = `${username}_image_${selectedId}.png`;

formData.append('live_site_link', liveSiteLink);
formData.append('github_link', githubLink);
formData.append('caption', caption);
formData.append('username', username);
formData.append('image', image, filename);

  try {
    const response = await fetch(`${Constants.SERVER_URL}/tech-images/${username}`, {
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


  const handleReset = () => {
    setLiveSiteLink('');
    setGithubLink('');
    setCaption('');
    setImage([]);
    setSelectedId(1);
  };

const handleEdit = async (e) => {
  e.preventDefault();

  if (!username || !selectedId || !image || !liveSiteLink || !githubLink || !caption) {
    console.error('Required data is missing');
    return;
  }


 const formData = new FormData();
 const filename = `${username}_image_${selectedId}.png`;

formData.append('live_site_link', liveSiteLink);
formData.append('github_link', githubLink);
formData.append('caption', caption);
formData.append('username', username);
formData.append('image', image, filename);

  try {
    const response = await fetch(`${Constants.SERVER_URL}/update-project/${selectedId}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Image uploaded successfully:', data.imageUrl);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }


}

  return (
    <>
    <div id='container'>
    <div className="drop-zone" style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
      <form>
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
        <p>Live site link: <input type='text' onChange={(e) => setLiveSiteLink(e.target.value)} required /></p>
        <p>GitHub link: <input type='text' onChange={(e) => setGithubLink(e.target.value)} required /></p>
        <p>Caption: <input type='text' onChange={(e) => setCaption(e.target.value)} required /></p>
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        <br></br>
        <br></br>

        
        <button type='reset' onClick={handleReset}>Reset</button>
        <button type='edit' onClick={handleEdit}>Edit</button>
        <button type='submit' onClick={handleFormSubmit}>Submit</button>
        
        
      </form>
    </div>
    </div>
    </>
  );
};