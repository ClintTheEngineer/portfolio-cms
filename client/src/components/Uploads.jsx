import { useState, useEffect } from "react";

export const Uploads = () => {
  const [images, setImages] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/uploads/${username}`);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        } else {
          console.error('Failed to fetch images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages(); // Call the fetchImages function
  }, [username]); // Empty dependency array ensures useEffect runs only once

  return (
    <div className="image-container">
      <h2>Your Uploaded Images</h2>
      <div className="images">
        {images.map((imageUrl, index) => (
          <img key={index} src={`http://localhost:5000${imageUrl}`} alt={`uploaded-${index}`} />
        ))}
      </div>
    </div>
  );
};
