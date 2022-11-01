import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import Navbar from '../Navbar';
import NotFoundPage from '../../pages/NotFoundPage'

const index = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Home/>} />
                <Route exact path="/profil" element={<Profil/>} />
                <Route path="*" element={<NotFoundPage/>} />
            </Routes>
        </Router>
    );
};

export default index;