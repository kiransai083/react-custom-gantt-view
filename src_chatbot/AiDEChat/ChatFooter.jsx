import React, { useState } from "react";
import { Flex, Text, Button, Textarea } from "@chakra-ui/react";

const Footer = ({ inputMessage, setInputMessage, handleSendMessage }) => {

    const [isAgent, setIsAgent] = useState(true);

    return (
        <Flex w="100%" mt="5" align={"center"} alignSelf="flex-end">

            <Textarea
                width="100%"
                fontFamily={"BlinkMacSystemFont"}
                resize="none"
                placeholder="Type your query or talk to BoltChat here ..."
                border="2px solid #F2F2F2"
                p="0.5rem 1rem"
                borderRadius="0.5rem"
                fontSize={"1rem"}
                _focus={{
                    border: "1px solid black",
                    outline: "none"
                }}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        handleSendMessage();
                    }
                }}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
            />
        </Flex>
    );
};

export default Footer;
