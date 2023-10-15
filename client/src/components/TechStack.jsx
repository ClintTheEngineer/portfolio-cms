import { useState } from 'react';

export const TechStack = () => {
  const [image, setImage] = useState(null);
  
const username = localStorage.getItem('username')

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch(`http://localhost:5000/tech-images/${username}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded successfully:', data.imageUrl);
        // Handle success, e.g., update state or show a success message
      } else {
        console.error('Image upload failed');
        // Handle failure, e.g., show an error message
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div>
      <h2>Upload Tech Stack Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};




