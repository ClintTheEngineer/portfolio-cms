import { useState, useEffect } from "react";
import { Constants } from "./Constants";

export const Uploads = () => {
  const [images, setImages] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [links, setLinks] = useState([]);
  const [githubLinks, setGitHubLinks] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project data
        const projectsResponse = await fetch(`${Constants.SERVER_URL}/${username}/projects`);
        if (!projectsResponse.ok) {
          throw new Error('Failed to fetch projects');
        }
        const projectData = await projectsResponse.json();

        // Fetch captions, links, and GitHub links concurrently
        const captionPromises = projectData.map((_, index) =>
          fetch(`${Constants.SERVER_URL}/${username}/projects/caption/${index + 1}`).then(response => 
            response.ok ? response.text() : `Caption for image ${index + 1} not found`
          )
        );

        const linkPromises = projectData.map((_, index) =>
          fetch(`${Constants.SERVER_URL}/${username}/projects/livelinks/${index + 1}`).then(response => 
            response.ok ? response.text() : `Link for image ${index + 1} not found`
          )
        );

        const githubPromises = projectData.map((_, index) =>
          fetch(`${Constants.SERVER_URL}/${username}/projects/github/${index + 1}`).then(response => 
            response.ok ? response.text() : `GitHub link for image ${index + 1} not found`
          )
        );

        // Fetch image URLs
        const imagePromises = projectData.map((_, index) => 
          `${Constants.SERVER_URL}/uploads/${username}/${username}_image_${index + 1}.png`
        );

        // Wait for all fetches to complete
        const [captions, links, githubLinks, imageUrls] = await Promise.all([
          Promise.all(captionPromises),
          Promise.all(linkPromises),
          Promise.all(githubPromises),
          Promise.all(imagePromises)
        ]);

        // Update state with fetched data
        setCaptions(captions);
        setLinks(links);
        setGitHubLinks(githubLinks);
        setImages(imageUrls);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [username]);

  return (
    <section>
      <div className="image-container">
        <h2 id="image-header">Your Projects</h2>
        <div className="images">
          {images.map((imageUrl, index) => (
            <div key={index + 1}>
              <img
                src={imageUrl} 
                style={{ maxWidth: '400px', margin: '10px' }} 
                alt={`uploaded-${index + 1}`} 
                title={`Project ${index + 1}`} 
              />
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
