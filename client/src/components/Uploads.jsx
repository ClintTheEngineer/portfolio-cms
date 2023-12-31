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
          // Exclude the last image from the fetched data
          setImages(data.slice(0, -1));
        } else {
          console.error('Failed to fetch images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [username]);

  return (
    <section>
      <div className="image-container">
        <h2>Your Uploaded Images</h2>
        <div className="images">
          {images.map((imageUrl, index) => (
            <img key={index} src={`http://localhost:5000${imageUrl}`} style={{ maxWidth: '400px', margin: '10px' }} alt={`uploaded-${index}`} title={`Project ${index+1}`} />
          ))}
        </div>
      </div>
    </section>
  );
};
