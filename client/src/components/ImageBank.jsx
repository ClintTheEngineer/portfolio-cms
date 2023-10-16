import { useEffect } from "react";
import { PortfolioEditor } from "./PortfolioEditor";
import { LogoutButton } from "./LogoutButton";
import { useNavigate } from "react-router-dom";
import { Uploads } from "./Uploads";

export const ImageBank = () => {
  /*const [setFormData] = useState({
    liveSiteLink: '',
    githubLink: '',
    caption: '',
    images: [],
  });*/

  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleFormSubmit = (formData) => {
    // Handle form submission logic here with formData (liveSiteLink, githubLink, caption, and images)
    console.log("Form submitted:", formData);
    // Optionally, reset the form fields and image state after submission
    /*
    setFormData({
      liveSiteLink: '',
      githubLink: '',
      caption: '',
      images: [],
    });*/
  };

  return (
    <>
      <nav>Welcome, {username ? username.toUpperCase() : ''}
      <span id="asset-tag"><a href="/tech-stack" alt="tech stack">Upload Additional Assets</a></span>
        <LogoutButton />
      </nav>
      <PortfolioEditor onSubmit={(data) => handleFormSubmit(data)} />
      <aside>
        <Uploads />
      </aside>
    </>
  );
};