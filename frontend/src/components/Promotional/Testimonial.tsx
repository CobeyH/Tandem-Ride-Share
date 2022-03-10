import {
  Box,
  Circle,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { ImQuotesLeft } from "react-icons/all";
import { Quotee } from "./Quotee";

export const Testimonal = () => (
  <Box
    as="section"
    bg={useColorModeValue("${rgba(1, 1, 1, 0.35)}", "gray.800")}
  >
    <Box
      maxW="3xl"
      mx="auto"
      px={{ base: "6", md: "8" }}
      pt="12"
      pb="16"
      borderColor="black"
      borderWidth={2}
      borderRadius={15}
    >
      <Flex direction="column" align="center" textAlign="center">
        <ImQuotesLeft color={useColorModeValue("gray.300", "gray.600")} />
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="medium" mt="6">
          &ldquo;Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
          expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in
          laborum sed rerum et corporis.&rdquo;
        </Text>
        <Quotee
          name="Marrie Jones"
          jobTitle="Marketing Ads Strategist"
          imageSrc="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixid=MXwxMjA3fDB8MHxzZWFyY2h8OTN8fGxhZHklMjBoZWFkc2hvdCUyMHNtaWxpbmd8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
          mt="8"
        />
      </Flex>
      <HStack
        justify="center"
        spacing="4"
        mt="8"
        color={useColorModeValue("gray.300", "gray.600")}
      >
        <Circle size="3" bg="blue.500" />
        <Circle size="2" bg="currentColor" />
        <Circle size="2" bg="currentColor" />
      </HStack>
    </Box>
  </Box>
);
function rgba(arg0: number, arg1: number, arg2: number, arg3: number): any {
  throw new Error("Function not implemented.");
}
