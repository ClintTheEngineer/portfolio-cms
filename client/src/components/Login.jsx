import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';


export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('')
  const navigate = useNavigate();

  Login.propTypes = {
    setToken: PropTypes.func.isRequired,
  };
    
  useEffect(() => {
    const token = localStorage.getItem('token')
   if(token){
    navigate('/editor')
   }
   }, [navigate])

   const HandleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
console.log(response);
      const data = await response.json();
      if (response.status === 200) {
        const token = data.token;
        const username = data.username;
        setToken(token);
        setUsername(username);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        navigate('/editor');
      } else if(response.status === 400){
        setErrorMessage('Login failed')
        console.error('Login failed:', response.status)
      } else if(response.status === 401){
        setErrorMessage('Incorrect username/password.')
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      HandleLogin();
    }
  };


  return (
    <>
    <h2 id='login-hdr' className='app-name'>Cander Portfolio CMS</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyUp={handleKeyPress}
      />
      <button id='login-btn' onClick={HandleLogin} onKeyUp={handleKeyPress}>Login</button>
      <Link id='reset-pswd' title='Click here to reset your password' to="/forgot-password">Forgot Password</Link>
      <p>{errorMessage}</p>
    </>
  )
}
