import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ImageBank } from './components/ImageBank';
import { Uploads } from './components/Uploads';
import PrivateRoutes from './components/PrivateRoutes';
import { PortfolioEditor } from './components/PortfolioEditor';
import { TechStack } from './components/TechStack';
import { ForgotPassword } from './components/ForgotPassword';

function App() {
   const setToken = useState('');
   const username = localStorage.getItem('username');
  return (
    <>
    <Router>
    <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/login' element={<Login setToken={setToken} />} />
    <Route path='/register' element={<Register />} />  
    <Route path='/forgot-password' element={<ForgotPassword />} />    
    <Route element={<PrivateRoutes />}>
    <Route path='/uploads/:username' element={<Uploads setToken={setToken} username={username} />} />  
    <Route path='/editor' element={<ImageBank />} />
    <Route path='/portfolio-editor' element={<PortfolioEditor />} />
    <Route path='/tech-stack' element={<TechStack />} />
    </Route>
    </Routes>
    </Router>
    </>
  )
}

export default App