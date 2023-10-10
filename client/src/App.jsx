import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ImageBank } from './components/ImageBank';
import { Uploads } from './components/Uploads';

function App() {
   const [setToken] = useState('');
   const username = localStorage.getItem('username');
  return (
    <>
    <Router>
    <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/login' element={<Login setToken={setToken} />} />
    <Route path='/register' element={<Register />} />
    <Route path='/editor' element={<ImageBank />} />
    <Route path='/uploads/:username' element={<Uploads setToken={setToken} username={username} />} />
    </Routes>
    </Router>
    </>
  )
}

export default App