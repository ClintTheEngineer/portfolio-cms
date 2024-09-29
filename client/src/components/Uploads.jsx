import { useState, useEffect } from "react";
import { Constants } from "./Constants";

export const Uploads = () => {
  const [images, setImages] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [links, setLinks] = useState([]);
  const [githubLinks, setGitHubLinks] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${Constants.SERVER_URL}/uploads/${username}`);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
          console.log(data)
          // Fetch captions for each image
          const captionPromises = data.map(async (_, index) => {
            const response = await fetch(`${Constants.SERVER_URL}/${username}/projects/caption/${index+1}`);
            if (response.ok) {
              const caption = await response.text();
              return caption;
            } else {
              return `Caption for image ${index+1} not found`;
            }
          });
          const captions = await Promise.all(captionPromises);
          setCaptions(captions);
        } else {
          console.error('Failed to fetch images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [username]);



  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${Constants.SERVER_URL}/uploads/${username}`);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
          // Fetch captions for each image
          const linkPromises = data.map(async (_, index) => {
            const response = await fetch(`${Constants.SERVER_URL}/${username}/projects/livelinks/${index+1}`);
            if (response.ok) {
              const links = await response.text();
              return links;
            } else {
              return `Link for image ${index+1} not found`;
            }
          });
          const links = await Promise.all(linkPromises);
          setLinks(links);
        } else {
          console.error('Failed to fetch images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchLinks();
  }, [username]);



  useEffect(() => {
    const githubLinks = async () => {
      try {
        const response = await fetch(`${Constants.SERVER_URL}/uploads/${username}`);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
          // Fetch captions for each image
          const linkPromises = data.map(async (_, index) => {
            const response = await fetch(`${Constants.SERVER_URL}/${username}/projects/github/${index+1}`);
            if (response.ok) {
              const github = await response.text();
              return github;
            } else {
              return `Link for image ${index+1} not found`;
            }
          });
          const githubLinks = await Promise.all(linkPromises);
          setGitHubLinks(githubLinks);
        } else {
          console.error('Failed to fetch images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    githubLinks();
  }, [username]);




  return (
    <section>
      <div className="image-container">
        <h2 id="image-header">Your Projects</h2>
        <div className="images">
          {images.map((imageUrl, index) => (
            <div key={index}>
              <img src={`${Constants.SERVER_URL}${imageUrl}`} style={{ maxWidth: '400px', margin: '10px' }} alt={`uploaded-${index}`} title={`Project ${index+1}`} />
              <p>Caption: {captions[index]}</p>
              <p>Live Link: {links[index]}</p>
              <p>Github: {githubLinks[index]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};