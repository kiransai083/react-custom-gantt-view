import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import './styles.scss';

export const OrderCard = ({ onSelectOption, item, index }) => {

    const [hoverID, setHoverID] = useState(0);

    return (
        <Flex mt="1.5rem" key={index} w="100%" align={"flex-start"}>
            <Flex
                className="card-container"
                direction="column"

            >
                <Text m="0" fontSize={"1rem"} color="#fff" align={"left"}>
                    Please select the order ID
                </Text>

                <Text onMouseLeave={() => setHoverID(0)} onMouseEnter={() => setHoverID(1)} onClick={() => onSelectOption("58509115601")} cursor={"pointer"} p="0.1rem 0.5rem" borderRadius={"5px"} background={"white"} color="#0072D3">
                    # 58509115601 - Set of 20 Foil Cards
                </Text>

                <Text onMouseLeave={() => setHoverID(0)} onMouseEnter={() => setHoverID(2)} mt="0px" onClick={() => onSelectOption("018331")} cursor={"pointer"} p="0.1rem 0.5rem" borderRadius={"5px"} background={"white"} color="#0072D3">
                    # 58509337507 - Everyday Canvas Tote
                </Text>

                {hoverID == 1 && <Flex direction={"column"} p="10px" top="0" right="-26%" position={"absolute"} backgroundColor="white" border="1px solid #0000001b">

                    <img src="" height="100px" />

                </Flex>}

                {hoverID == 2 && <Flex direction={"column"} p="10px" top="0" right="-36%" position={"absolute"} backgroundColor="white" border="1px solid #0000001b">

                    <img src="" height="100px" />

                </Flex>}
            </Flex>
        </Flex>
    );
}