import React, { useState, useEffect, useRef } from "react";
import { Textarea, Flex, Text, Box, Select } from "@chakra-ui/react";
import './styles.scss';
import axios from 'axios';
import BoltChatLogo from '../assets/images/BoltLogo.svg';
import { getAgentResponse } from "./apiService";
import homeIcon from '../assets/images/home-icon.svg';
import sendIcon from '../assets/images/send-icon.svg';
import TypingGIF from '../assets/images/typing.gif';
import thumbsUpIcon from '../assets/images/thumbs-up-icon.svg';
import thumbsDownIcon from '../assets/images/thumbs-down-icon.svg';
import aideMiniIcon from '../assets/images/aide-mini-icon.svg';
import smileIcon from '../assets/images/feather-smile-icon.svg';
import attachmentIcon from '../assets/images/metro-attachment-icon.svg';
import { Rating } from 'react-simple-star-rating';
import DispositionLinks from '../assets/disppositionLinksList.json';
import DispositionList from '../assets/dispositionList.json';
import { OrderCard } from "./ActionCards/orderCard";
import { GiftCard } from "./ActionCards/giftCard";
import { AddressCard } from "./ActionCards/addressCard";
import { split } from 'sentence-splitter';
import { VoiceButton } from "./VoiceButton/voiceButton";
import { useNavigate } from "react-router-dom";

const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
};

const AiDEChat = ({ type }) => {
    console.log("🚀 ~ file: AiDEChat.jsx:32 ~ AiDEChat ~ type:", type)

    useEffect(() => {
        console.log("rendering");
    }, []);

    const prepareConversation = () => {
        switch (type) {
            case 'briefs':
            case 'uploads':
                break;
            case 'approvals':
                setConversation([...conversation, {
                    "from": "BOT",
                    "text": "Would you like to check the approval details for any particular asset?"
                }])
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        console.log("rendering");
    }, [type]);

    // Use them as attachments
    const [files, setFiles] = useState([]);

    const hiddenFileInput = React.useRef(null);

    const handleUploadClick = event => {
        hiddenFileInput.current.click();
    };

    // Call a function
    // to handle the user-selected file 
    const handleFileInputChange = async (event) => {

        const fileUploaded = event.target.files;
        setFiles(fileUploaded)
        console.log(fileUploaded);

        let newData = conversation;
        for (let i = 0; i < fileUploaded.length; i++) {

            newData.push({
                "from": "USER",
                "text": fileUploaded[i].name,
                "attachment": URL.createObjectURL(fileUploaded[i])
            });
        }

        setConversation(newData);
        console.log("New Conversation: ", newData);

        setInputMessage("");
        setUrlLink("");

    };


    const [inputMessage, setInputMessage] = useState("");

    // const [conversation, setConversation] = useState([{
    //     "from": "BOT",
    //     "text": "Hello! \n Welcome to Campaign",
    //     "attachment": ''
    // }, {
    //     "from": "BOT",
    //     "text": "Let me know if I can assit you with the following processes",
    //     "attachment": ''
    // }]);
    const [conversation, setConversation] = useState([]);

    const [showStars, setShowStars] = useState(0);

    const [showChatLoading, setShowChatLoading] = useState(false);

    const [showAiDEChat, setShowAiDEChat] = useState(true);

    const [urlLink, setUrlLink] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const handleVoiceAPIError = () => {

        setErrorMsg("Voice feature is unavailable at the moment");

        setInterval(() => {
            setErrorMsg("");
        }, 4000);

    }

    const onUserEnterMessage = async () => {

        let newConv = conversation;
        console.log(conversation)
        if (newConv.at(-1) && (newConv.at(-1).from == 'ACTION-GIFTS' || newConv.at(-1).from == 'ACTION-ORDER-ID')) {
            newConv.pop();
        }
        newConv.push({
            "from": "USER",
            "text": inputMessage.replace("\n", "")
        });

        setConversation(newConv);
        setInputMessage("");
        setShowChatLoading(true);
        setUrlLink("");

        callAI(newConv);

    }

    const callAI = async (newConv) => {

        let prompt = [];
        await newConv.map((item, index) => {
            if (item.from.toUpperCase() == "USER") {
                prompt.push({
                    'user': item.text
                });
            }
            else {
                prompt.push({
                    'assistant': item.text
                });
            }
        });

        var data = {
            "prompt": prompt,
            "origin": "bot"
        };

        console.log("PROMPT :", prompt)

        let response = await getAgentResponse(data);

        console.log(response.data);
        let reply = response.data.response;

        const sentences = split(reply);
        let bubbles = splitTextIntoBubbles(sentences);
        setShowChatLoading(false);

        let delayIndex = 0;

        // This populates each bubble one by one with a delay
        bubbles.forEach((text, index) => {
            if (text.trim() != "") {

                delayIndex = index;
                let delay = (index) * 2000;

                setTimeout(() => {
                    setConversation(prevConv => [...prevConv, {
                        "from": "BOT",
                        "text": text
                    }]);
                }, delay);
                // setConversation(newConv)

            }
        });

        // Check for URLs in the reply to activate the Visit Link button if found
        let urls = detectURLs(reply);
        if (urls && urls.length) {
            if (urls[0].endsWith(".")) {
                setUrlLink(urls[0].slice(0, -1));
            }
            else {
                setUrlLink(urls[0])
            }
        }

        delayIndex += 1;

        setShowChatLoading(false);

        if ((reply.includes("bye")) || reply.includes("ave a great day") || reply.includes("ave a wonderful day")) {
            setShowStars(true)
        }

        if ((reply.includes("agent") || reply.includes("colleague")) && reply.includes("transfer") && !reply.includes("?")) {

            setTimeout(() => {
                setConversation(prevConv => [...prevConv, {
                    "from": "SYSTEM",
                    "text": "Mathew has joined the chat"
                }]);
            }, delayIndex * 2000);

            // Use the below snippet for Agent Transfer when needed

            // var data = JSON.stringify({
            //     "conv": newConv,
            // });
            // const res = await doAgentTransfer(data);
            // console.log(res);
        }

        // The following checks for any Action Card requiremens and appends that element into the conversation

        if ((reply.includes("screen") && reply.includes("number from the list")) || (reply.includes("order number") && reply.includes("please provide") && !reply.includes("cancel"))) {

            setTimeout(() => {
                setConversation(prevConv => [...prevConv, {
                    "from": "ACTION-ORDER-ID",
                    "text": "Which Order?"
                }]);
            }, delayIndex * 2000);
        }
        else if ((reply.includes("screen") || reply.includes("address from the list")) && reply.includes("shipping address")) {


            setTimeout(() => {
                setConversation(prevConv => [...prevConv, {
                    "from": "ACTION-SHIPPING-ADDR",
                    "text": "Which Address?"
                }]);
            }, delayIndex * 2000);
        }
        else if ((reply.includes("screen") && reply.includes("gift"))) {

            setTimeout(() => {
                setConversation(prevConv => [...prevConv, {
                    "from": "ACTION-GIFTS",
                    "text": "Gift suggestions"
                }]);
            }, delayIndex * 2000);
        }

    }

    function splitTextIntoBubbles(sentences) {
        let bubbles = [];
        let currentBubble = '';

        sentences.forEach((sentenceObj) => {

            console.log(sentenceObj)

            if (sentenceObj.type == 'Sentence') {
                currentBubble += sentenceObj.raw;
            }
            else {
                if (currentBubble.length > 200) {

                    // Remove \n if found at the end.
                    if (currentBubble.endsWith("\n")) {
                        currentBubble = currentBubble.replace(/\n$/, '');
                    }
                    bubbles.push(currentBubble);
                    currentBubble = '';
                } else {
                    currentBubble += sentenceObj.raw;
                }
            }
        });

        if (currentBubble.endsWith("\n")) {
            currentBubble = currentBubble.replace(/\n$/, '');
        }

        bubbles.push(currentBubble);

        return bubbles;

    }

    const setConversationText = (conv) => {
        setConversation(prevConv => [...prevConv, ...conv]);
        setShowChatLoading(true)
        callAI(conv)
    }


    const onToggleChat = (flag) => {

        clearConversations();
        setShowAiDEChat(flag);
    }

    const clearConversations = () => {
        setConversation([]);
        setShowStars(false);
    }

    const onOptionClick = (msg) => {

        let newConv = conversation;
        console.log(conversation);

        newConv.push({
            "from": "USER",
            "text": msg
        });

        setConversation(newConv);
        setInputMessage("");
        setShowChatLoading(true);
        callAI(newConv);
    }

    function detectURLs(text) {

        setUrlLink("");
        // Regular expression to match URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // Find all matches of the regex in the text
        const matches = text.match(urlRegex);

        // Return the matches
        return matches;
    }

    // When user selects an option from the Action cards, below function runs.
    const onSelectOption = (text) => {

        // Remove the action card and replace it with the chosen value.
        let newConv = conversation;
        console.log(conversation);
        newConv.pop();
        newConv.push({
            "from": "USER",
            "text": text
        });

        setConversation(newConv);
        setInputMessage("");
        setShowChatLoading(true);

        callAI(newConv);
    }

    return (
        <div className="aide-chat-container">

            <input
                type="file"
                multiple
                ref={hiddenFileInput}
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
            />

            <div style={{ position: 'absolute', right: '10px', top: '-25px', fontWeight: 'bold', opacity: 0.3, fontSize: '0.8rem' }}>
                Powered by AiDE
            </div>

            <div id="chat-title-container">

                <div className="chat-title-content">

                    <img className="profile-icon" src={BoltChatLogo} height="60px" />

                </div>

                {conversation.length > 0 && <Box mt="5px" cursor={'pointer'} className="close-chatbox" onClick={() => { onToggleChat(false) }}>
                    <img src={homeIcon} height="30px" alt="close" />
                </Box>}

            </div>

            <Flex flex="0.9" direction={"column"} alignItems="flex-end">

                {conversation.length == 0 && type === 'brief' && <Flex mt="10px" direction={"column"} width="100%" alignItems={"center"} justifyContent={"center"} >

                    <img src="https://cdn.dribbble.com/users/1053528/screenshots/5100616/media/fbc93e5f50b13718ea6058008f12aa1a.gif" height="110rem" />
                    <Text fontSize={"1.4rem"} mb="10px">
                        How can I help you?
                    </Text>

                    <div style={{ height: '2px', backgroundColor: '#0000001b', width: '80%', marginBottom: '2rem' }}>

                    </div>

                    <Flex direction={"column"} alignItems="flex-start" width={"100%"}>

                        {DispositionList.map((item) => {
                            return (

                                <Text mt="0" onClick={() => onOptionClick(item)} backgroundColor={"F4F4ED"} cursor="pointer" borderRadius="5px" color="#29292A" p="0.2rem 0.5rem" border="1px solid #29292A" ml="1rem">
                                    {item}
                                </Text>

                            )
                        })}

                    </Flex>
                </Flex>}

                {conversation.length == 0 && type === 'uploads' && <Flex mt="10px" direction={"column"} width="100%" alignItems={"center"} justifyContent={"center"} >

                    <img src="https://cdn.dribbble.com/users/1053528/screenshots/5100616/media/fbc93e5f50b13718ea6058008f12aa1a.gif" height="110rem" />
                    <Text fontSize={"1.4rem"} mb="10px">
                        How can I help you?
                    </Text>

                    <div style={{ height: '2px', backgroundColor: '#0000001b', width: '80%', marginBottom: '2rem' }}>

                    </div>

                    <Flex direction={"column"} alignItems="flex-start" width={"100%"}>

                        {['Recent Uploads'].map((item) => {
                            return (

                                <Text mt="0" onClick={() => onOptionClick(item)} backgroundColor={"F4F4ED"} cursor="pointer" borderRadius="5px" color="#29292A" p="0.2rem 0.5rem" border="1px solid #29292A" ml="1rem">
                                    {item}
                                </Text>

                            )
                        })}

                    </Flex>
                </Flex>}

                {conversation.length == 0 && !type && <Flex mt="10px" direction={"column"} width="100%" alignItems={"center"} justifyContent={"center"} >

                    <img src="https://cdn.dribbble.com/users/1053528/screenshots/5100616/media/fbc93e5f50b13718ea6058008f12aa1a.gif" height="110rem" />
                    <Text fontSize={"1.4rem"} mb="10px">
                        How can I help you?
                    </Text>

                    <div style={{ height: '2px', backgroundColor: '#0000001b', width: '80%', marginBottom: '2rem' }}>

                    </div>
                    <Flex p="1rem" boxSizing="border-box" overflowY={"scroll"} direction={"column"} width="100%">
                        {[{
                            "from": "BOT",
                            "text": "Hello! \n Welcome to Campaign",
                            "attachment": ''
                        }, {
                            "from": "BOT",
                            "text": "Let me know if I can assit you with the following processes",
                            "attachment": ''
                        }].map((item, index) => <Flex key={index} w="100%" direction={"column"} align={"flex-start"}>
                            <Flex
                                bg="#E36730"
                                color="#FFF"
                                minW="100px"
                                maxW="90%"
                                my="5"
                                p="0.6rem 1rem"
                                borderRadius="8px"
                                borderTopLeftRadius={"0"}
                                boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.05), 0 6px 20px 0 rgba(0, 0, 0, 0.05)"
                            >
                                <Text m="0" fontSize={"1rem"} color="#fff" align={"left"}>
                                    {item.text.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </Text>
                            </Flex>

                            <Flex mt="0" width={'95%'} alignItems={"center"} justifyContent={"space-between"}>

                                {conversation.length - 1 == index && <Flex>
                                    <img src={thumbsUpIcon} height="20px" />
                                    <img style={{ marginLeft: '5px' }} src={thumbsDownIcon} height="20px" />
                                </Flex>}

                            </Flex>

                        </Flex>)}
                    </Flex>

                    <Flex direction={"column"} alignItems="flex-start" width={"100%"}>

                        {DispositionLinks.map((item) => {
                            const { key, label, path, type } = item || {};
                            return (

                                <Text key={key} mt="0" onClick={() => {
                                    if (type === 'page') {
                                        navigate(path);
                                    } else if (type === 'popup') {
                                        const message = {
                                            type: path
                                        };

                                        // Sending a message to the child window
                                        window.postMessage(message, '*');
                                    }
                                }} backgroundColor={"F4F4ED"} cursor="pointer" borderRadius="5px" color="#29292A" p="0.2rem 0.5rem" border="1px solid #29292A" ml="1rem">
                                    {label}
                                </Text>

                            )
                        })}

                    </Flex>

                    {/* <Flex direction={"column"} alignItems="flex-start" width={"100%"}>

                        {DispositionList.map((item) => {
                            return (

                                <Text mt="0" onClick={() => onOptionClick(item)} backgroundColor={"F4F4ED"} cursor="pointer" borderRadius="5px" color="#29292A" p="0.2rem 0.5rem" border="1px solid #29292A" ml="1rem">
                                    {item}
                                </Text>

                            )
                        })}

                    </Flex> */}
                </Flex>}


                {conversation.length > 0 && <Flex height="60vh" p="1rem" boxSizing="border-box" overflowY={"scroll"} direction={"column"} width="100%">
                    {conversation.map((item, index) => {
                        if (item.from === "USER") {
                            return (
                                <Flex mt="1.5rem" key={index} w="100%" direction={"column"} alignItems="flex-end">
                                    <Flex
                                        bg="#E6EBF1"
                                        color="#585858"
                                        minW="100px"
                                        maxW="80%"
                                        my="5"
                                        p="0.6rem 1rem"
                                        borderRadius="8px"
                                        borderTopRightRadius={"0"}
                                        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.05), 0 6px 10px 0 rgba(0, 0, 0, 0.05)"
                                    >
                                        <Text m="0" fontSize={"1rem"} wordBreak='break-word' color="#000">{item.text}</Text>

                                    </Flex>
                                    {item.attachment && <img style={{ marginTop: '10px' }} src={item.attachment} height="100px" />}

                                </Flex>
                            );
                        } else if (item.from == "BOT" || item.from == "AGENT") {
                            return (
                                <Flex mt="1.5rem" key={index} w="100%" direction={"column"} align={"flex-start"}>
                                    <Flex
                                        bg="#E36730"
                                        color="#FFF"
                                        minW="100px"
                                        maxW="90%"
                                        my="5"
                                        p="0.6rem 1rem"
                                        borderRadius="8px"
                                        borderTopLeftRadius={"0"}
                                        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.05), 0 6px 20px 0 rgba(0, 0, 0, 0.05)"
                                    >
                                        <Text m="0" fontSize={"1rem"} color="#fff" align={"left"}>
                                            {item.text.split('\n').map((line, index) => (
                                                <React.Fragment key={index}>
                                                    {line}
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </Text>
                                    </Flex>

                                    <Flex mt="0" width={'95%'} alignItems={"center"} justifyContent={"space-between"}>

                                        {conversation.length - 1 == index && <Flex>
                                            <img src={thumbsUpIcon} height="20px" />
                                            <img style={{ marginLeft: '5px' }} src={thumbsDownIcon} height="20px" />
                                        </Flex>}

                                    </Flex>

                                </Flex>
                            );
                        }
                        else if (item.from == "SYSTEM") {
                            return (

                                <Flex direction="row" mt="1.5rem" key={index} w="100%" opacity={0.5} alignItems={"center"} justify="center">
                                    <Flex mr="10px" height="2px" width="40px" backgroundColor="black">
                                    </Flex>
                                    <Text>
                                        {item.text}
                                    </Text>

                                    <Flex ml="10px" height="2px" width="40px" backgroundColor="black">
                                    </Flex>
                                </Flex>

                            )
                        }
                        else if (item.from == "ACTION-ORDER-ID") {
                            return (
                                <OrderCard onSelectOption={onSelectOption} item={item} index={index} />
                            )
                        }
                        else if (item.from == "ACTION-SHIPPING-ADDR") {
                            return (
                                <AddressCard onSelectOption={onSelectOption} item={item} index={index} />
                            )
                        }
                        else if (item.from == "ACTION-GIFTS") {
                            return (
                                <GiftCard onSelectOption={onSelectOption} item={item} index={index} />
                            )
                        }

                    })}

                    {/* {conversation.at(-1).attachment && <Flex width={"100%"} justifyContent={"flex-end"}>

                        <Select mt="20px" width="60%" fontSize={"1rem"} onChange={(e) => onOptionClick(e.target.value)} placeholder="Choose your issue">
                            <option value='Product / Shipping Damage'>Product / Shipping Damage</option>
                            <option value='Red Eyes'>Red Eyes</option>
                            <option value='Paper Quality'>Paper Quality</option>
                            <option value='Color Spots'>Color Spots</option>

                        </Select>

                    </Flex>} */}

                    {urlLink && <Text px="10px" pb="5px" borderRadius={"5px"} mt="5px" textAlign={"center"} width="20%" color="white" backgroundColor="#0072D3"> <a target={"_blank"} style={{ textDecoration: "none", color: "white", fontSize: '12px' }} href={urlLink}> Visit Link </a> </Text>}

                    {showChatLoading && <img style={{ width: "60px", marginTop: "10px", marginLeft: '-5px' }} src={TypingGIF} height="40px" />}

                    <AlwaysScrollToBottom />


                </Flex>}

                {errorMsg && <Flex mb="1rem" w="100%" direction={"column"} align={"center"}>
                    <Text maxW={'80%'} p="0.4rem 2rem" m="0" align={'left'} color={'white'} backgroundColor={'#FC5F6B'}>
                        {errorMsg}</Text>
                </Flex>}

            </Flex >

            {
                showStars ? <Flex direction="column" width={"100%"} alignItems="center" justifyContent={"center"} pb="10px">
                    <Text fontSize={"0.8rem"} mb="0">
                        We value your feedback! Please rate your experience.
                    </Text>
                    <Rating size="28px" style={{ marginTop: '10px', alignSelf: 'center' }} />
                </Flex> :
                    <Flex flex="0.05" height="100%" align={"center"} flexDirection="column" borderTop="2px solid #F2F2F2" mx="8px">

                        <Box w="100%" display={'flex'} alignItems={"center"} justifyContent={"center"} padding={"0 1rem"} marginBottom={'0.5rem'}>
                            <Box onClick={handleUploadClick} ml="0.6rem" cursor={'pointer'}><img height="17" src={attachmentIcon} alt="Attach Icon" /></Box>

                            <Box width={"1px"} ml="0.7rem" height={"2rem"} backgroundColor={"#00000023"}>

                            </Box>

                            <Textarea
                                width="100%"
                                fontFamily={"BlinkMacSystemFont"}
                                resize="none"
                                placeholder="Select your issue or just type your query to chat..."
                                p="0.5rem 0.7rem"
                                border='none'
                                fontSize={"0.9rem"}
                                lineHeight={"1.4"}
                                _focus={{
                                    outline: "none"
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter" && e.target.value.trim() != '') {
                                        onUserEnterMessage();
                                    }
                                }}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                            />

                            <VoiceButton handleVoiceAPIError={handleVoiceAPIError} setConversationText={setConversationText} stopColor="#1aa79f" startColor="#1aa79f" />

                            <Box w='15%' onClick={onUserEnterMessage} cursor={'pointer'} display={'flex'} justifyContent={'flex-end'} pr='10px'>
                                <img src={sendIcon} alt="send" />
                            </Box>
                        </Box>

                        {/* <Box w="100%" display={'flex'} alignItems={'center'} pb='10px'>
                            <Box w='70%' display={'flex'} justifyContent={'flex-start'} pl='20px' alignItems={'center'}>
                                <Box cursor={'pointer'} mr="24px"><img src={smileIcon} alt="Smile Icon" /></Box>
                                <Box onClick={handleUploadClick} cursor={'pointer'} mr="32px"><img src={attachmentIcon} alt="Attach Icon" /></Box>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                    <span className="powered-by">
                                        Powered by
                                    </span>
                                    <img src={aideMiniIcon} alt="Aide Icon" />
                                </Box>
                            </Box>
                            <Box w='30%' cursor={'pointer'} display={'flex'} justifyContent={'flex-end'} pr='10px'>
                                <img src={sendIcon} alt="send" />
                            </Box>
                        </Box> */}
                    </Flex>
            }

        </div >
    );
}

export default AiDEChat;
