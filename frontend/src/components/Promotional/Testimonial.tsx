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
          &ldquo;Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
          expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in
          laborum sed rerum et corporis.&rdquo;
        </Text>
        <Quotee
          name="Marrie Jones"
          jobTitle="Marketing Ads Strategist"
          mt="8"
        />
      </Flex>
    </Box>
  </Box>
);
