import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { ImQuotesLeft } from "react-icons/all";
import { styleColors } from "../../theme/colours";
import { Quotee } from "./Quotee";

export const Testimonal = () => (
  <Box as="section">
    <Box
      maxW="3xl"
      mx="auto"
      px={{ base: "6", md: "8" }}
      pt="12"
      pb="16"
      borderColor={styleColors.deepBlue}
      borderWidth={0}
      borderRadius={15}
      bgColor="rgba(256,256,256,0.5)"
    >
      <Flex direction="column" align="center" textAlign="center">
        <ImQuotesLeft
          color={useColorModeValue(
            "${styleColors.deepBlue}",
            "${styleColors.deepBlue}"
          )}
        />
        <Text fontSize={{ base: "l", md: "xl" }} fontWeight="medium" mt="6">
          &ldquo;This app reminded me how much money everyone from high school
          to now owes me. 10/10&rdquo;
        </Text>
        <Quotee name="Oscar" jobTitle="Satisfied User" />
      </Flex>
    </Box>
  </Box>
);
