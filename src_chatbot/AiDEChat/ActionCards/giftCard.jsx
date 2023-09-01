import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import './styles.scss';

export const GiftCard = ({ onSelectOption, item, index }) => {

    const [hoverID, setHoverID] = useState(0);

    return (
        <Flex mt="1.5rem" key={index} w="100%" align={"flex-start"}>
            <Flex
                className="card-container"
                direction="column"
            >
                <Text m="0" fontSize={"1rem"} color="#fff" align={"left"}>
                    Here are some suggestions...
                </Text>

                <Text onMouseLeave={() => setHoverID(0)} onMouseEnter={() => setHoverID(1)} onClick={() => onSelectOption("Photo Coffee Mug 20oz")} cursor={"pointer"} p="0.1rem 0.5rem" borderRadius={"5px"} background={"white"} color="#0072D3">
                    Photo Coffee Mug 20oz
                </Text>

                <Text onMouseLeave={() => setHoverID(0)} onMouseEnter={() => setHoverID(2)} mt="0px" onClick={() => onSelectOption("Custom Throw Pillow, 18x18")} cursor={"pointer"} p="0.1rem 0.5rem" borderRadius={"5px"} background={"white"} color="#0072D3">
                    Custom Throw Pillow, 18x18
                </Text>

                {hoverID == 1 && <Flex direction={"column"} p="10px" top="0" right="-40%" position={"absolute"} backgroundColor="white" border="1px solid #0000001b">

                    <img src="" height="100px" />

                </Flex>}

                {hoverID == 2 && <Flex direction={"column"} p="10px" top="0" right="-40%" position={"absolute"} backgroundColor="white" border="1px solid #0000001b">

                    <img src="" height="100px" />

                </Flex>}
            </Flex>
        </Flex>
    );
}