import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AiDEChat from '../AiDEChat/AiDEChat';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import Header from './Header';
import HomePage from './HomePage';
import Popup from './Popup';
import BriefSteps from './../AiDEChat/brief.json';
import ApprovalSteps from './../AiDEChat/approval.json';
import BriefImage from '../assets/images/BriefStaticImage.png';
import DispositionLinks from '../assets/disppositionLinksList.json';


const ImageContainer = styled.div`
  width: 100%; /* Set your desired container width */
  height: 100%; /* Set your desired container height */
  overflow: hidden; /* Hide any image overflow outside the container */
`;

const FitImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Use 'contain' instead of 'cover' if you want to fit the image inside without cropping */
`;

const ChatBox = ({ }) => {
    const [data, setData] = useState(null);
    const [seqenceOrder, setSequenceOrder] = useState(0);
    const [popupType, setPopupType] = useState('');
    const [popupOpen, setPopupOpen] = useState(false);
    const [prompt, setPrompt] = useState(null);
    const [previousConv, setPreviousConv] = useState(null);

    const navigate = useNavigate();
    console.log("🚀 ~ file: ChatBox.jsx:14 ~ ChatBox ~ prompt:", prompt)
    useEffect(() => {

    }, [prompt])

    const openPopup = (type) => {
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupType('');
        setPopupOpen(false);
    };

    const getDispostions = () => {

        switch (data?.path) {
            case 'brief':
                return BriefSteps;
            case 'about':
                return ApprovalSteps;
            case 'upload':
                return [{
                    prompt: 'please filter uploads'
                }];

            default:
                break;
        }
    };

    const findNextSequence = (sequence = 0, propmt, type) => {
        let dynamicConerstionData = { brief: BriefSteps, about: ApprovalSteps }
        if (!type) {
            return;
        }
        const setNextConverstion = (dynamicConerstionData[type] || []).find((conv) => conv.order == sequence);
        let dataset = setNextConverstion;
        let matchedPromt = false;
        for (const key in dataset?.keywords) {
            if (key?.includes(propmt?.text)) {
                let orderIndex = dynamicConerstionData[type]?.find(function (item) {
                    return item.order == dataset?.keywords[key];
                });
                matchedPromt = true;
                console.log("old ", sequence, orderIndex?.order)
                setSequenceOrder(orderIndex?.order);
                return orderIndex;
            }
        }

        if (!matchedPromt && sequence == 0) {

            setSequenceOrder(0)
        }


    }



    const handleEvent = ({ type, path, prompt, sequence }) => {
        let enterText = prompt?.text;
        const matchedKey = DispositionLinks.find((data) => enterText?.includes(data?.key));
        const element = findNextSequence(sequence, prompt, path);


        let dynamicConerstionData = { brief: BriefSteps, about: ApprovalSteps }

        const previousConversation = (dynamicConerstionData[path] || []).find((conv) => conv.order == sequence);

        previousConversation && setPreviousConv(previousConversation);
        console.log("updated ", element, sequence)
        const promptType = matchedKey?.type || type;
        const promptPath = matchedKey?.path || path;
        if (matchedKey) {
            prompt = {}
        }
        setPopupType(promptPath);
        setPrompt(prompt);
        setData({ type: promptType, path: promptPath, prompt });
        if (promptType === 'page') {
            navigate(`/${promptPath}`);
        } else if (prompt && promptType === 'popup' && previousConversation?.ispopup) {
            openPopup(promptPath);
        }
    }






    useEffect(() => {
        window.addEventListener('message', function (event) {

            // if (event.origin !== 'http://parent-domain.com') {
            //   return; // Reject messages from other origins for security
            // }

            // Handle the received message
            const message = event.data;
            console.log('message:::::', message);

            console.log('Received:', message);

            handleEvent(message);

        });
    }, []);

    return (
        <>
            {/* <Sidebar /> */}
            {/* <Header openPopup={openPopup} /> */}


            <Routes>
                <Route path="/" element={
                    <ImageContainer>
                        <FitImage src={BriefImage} alt="Fitted Image" />
                    </ImageContainer>} />
                <Route path="/home" element={<HomePage prompt={prompt} />} />
                <Route path="/about" element={<AboutPage prompt={["yes","no"].includes(prompt?.text?.toLowerCase())? '': prompt}  />} />
                <Route path="/contact" element={<ContactPage prompt={prompt} />} />
            </Routes>
            <Popup type={popupType} isOpen={popupOpen} closePopup={closePopup} />
            <AiDEChat type={popupType} botData={data} promptOrder={seqenceOrder} defaultConv={getDispostions()} />
        </>
    );
};

export default ChatBox;
