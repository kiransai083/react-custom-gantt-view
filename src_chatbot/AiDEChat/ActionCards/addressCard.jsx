import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import './styles.scss';

export const AddressCard = ({ onSelectOption, item, index }) => {

    return (
        <Flex mt="1.5rem" key={index} w="100%" align={"flex-start"}>
            <Flex
                className="card-container"
                direction="column"
            >
                <Text m="0" fontSize={"1rem"} color="#fff" align={"left"}>
                    Please select your shipping address
                </Text>

                <Text onClick={() => onSelectOption("Selected Shipping Address: St.Patrick Road, West Hill, NY 10045.")} cursor={"pointer"} p="0.1rem 0.5rem" borderRadius={"5px"} background={"white"} color="#0072D3">
                    Home - St.Patrick Road, West Hill, NY 10045
                </Text>

                <Text mt="0px" onClick={() => onSelectOption("Selected Shipping Address: Beans Glide Street, North Austin, TX 73309")} cursor={"pointer"} p="0.1rem 0.5rem" borderRadius={"5px"} background={"white"} color="#0072D3">
                    Work - Beans Glide Street, North Austin, TX 73309
                </Text>
            </Flex>
        </Flex>
    )
}