import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Popup from './components/Popup';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import './App.css';
import AiDEChat from './AiDEChat/AiDEChat';
import ChatBox from './components/ChatBox';

const App = () => {

    // const handleEvent = ({ type, path }) => {
    //     if (type === 'page') {
    //         window.location.href = path;
    //     } else if (type === 'popup') {
    //         openPopup(path);

    //         // Sending a message to the child window
    //     }
    // }

    // useEffect(() => {
    //     window.addEventListener('message', function (event) {
    //         // if (event.origin !== 'http://parent-domain.com') {
    //         //   return; // Reject messages from other origins for security
    //         // }

    //         // Handle the received message
    //         const message = event.data;
    //         console.log('message:::::', message);
    //         if (message.type) {
    //             console.log('Received:', message);
    //             handleEvent(message);
    //         }
    //     });
    // }, []);

    return (
        <Router>
            <div className="app">
                <ChatBox />
            </div>
            {/* Rendering BoltChat Window */}
            {/* <AiDEChat type={popupType} /> */}
        </Router>
    );
};

export default App;
