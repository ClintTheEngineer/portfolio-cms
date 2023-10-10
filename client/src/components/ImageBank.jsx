import { useState, useEffect } from "react";
import { ImageForm } from "./PortfolioEditor";
import { LogoutButton } from "./LogoutButton";
import { useNavigate } from "react-router-dom";


export const ImageBank = () => {
    const [formsData, setFormsData] = useState([...Array(6)].map(() => ({
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
        <nav>Welcome, {username.toUpperCase()}</nav>
        {formsData.map((formData, index) => (
          <ImageForm key={index} index={index} onSubmit={(data) => handleFormSubmit(data, index)} />
        ))}
        <LogoutButton />
      </>
    );
  };