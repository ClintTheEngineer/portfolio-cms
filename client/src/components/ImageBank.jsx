import { useState, useEffect } from "react";
import { PortfolioEditor } from "./PortfolioEditor";
import { LogoutButton } from "./LogoutButton";
import { useNavigate } from "react-router-dom";
import { Uploads } from "./Uploads";


export const ImageBank = () => {
  const projectBlocks = 1;
    const [formsData, setFormsData] = useState([...Array(projectBlocks)].map(() => ({
      liveSiteLink: '',
      githubLink: '',
      caption: '',
      images: [],
    })));
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
      }
    }, [navigate]);
  
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
        <nav>Welcome, {username.toUpperCase()}
        <LogoutButton />
        </nav>
        {formsData.map((formData, index) => (
          <PortfolioEditor key={index} index={index} onSubmit={(data) => handleFormSubmit(data, index)} />
        ))}
        <aside>{<Uploads />}</aside>
        
      </>
    );
  };