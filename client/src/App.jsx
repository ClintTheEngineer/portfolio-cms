import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ImageBank } from './components/ImageBank';

function App() {
   const [token, setToken] = useState('');
   
  return (
    <>
    <Router>
    <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/login' element={<Login setToken={setToken} />} />
    <Route path='/register' element={<Register />} />
    <Route path='/editor' element={<ImageBank />} />
    </Routes>
    </Router>
    </>
  )
}

export default App