import {
  Box,
  Text,
  HStack,
  Image,
  Spacer,
  Center,
  VStack,
  Stack,
} from "@chakra-ui/react";
import * as React from "react";
import PriceSelector from "../components/Promotional/PriceSelector";
import ProductHeader from "../components/Promotional/ProductHeader";
import { Testimonal as Testimonial } from "../components/Promotional/Testimonial";
import { styleColors } from "../theme/colours";

const ProductPage = () => {
  return (
    <Box
      h="-webkit-fit-content"
      bgGradient={`linear(to-br, ${styleColors.mainBlue}, ${styleColors.lightBlue})`}
    >
      <ProductHeader />
      <Box h="-webkit-fit-content" ml={5} mr={5}>
        <Center>
          <HStack pt={{ base: 75, md: 175 }} pb={125}>
            <VStack align="center">
              <VStack align="left">
                <Text
                  color={styleColors.deepBlue}
                  fontSize={30}
                  fontWeight={"bold"}
                  align="center"
                >
                  Carpooling made easy.
                </Text>
                <Text
                  color={styleColors.deepBlue}
                  fontSize={30}
                  fontWeight={"bold"}
                  align="center"
                >
                  Carpooling made social.
                </Text>
              </VStack>
              <Text color={styleColors.deepBlue} fontSize={18} align="center">
                Connect your circles and get where you need to go together.
              </Text>
              <Box p={35}>
                <Image
                  src={"/logo_white.svg"}
                  alt="white logo"
                  objectFit="cover"
                  maxW="200px"
                />
                <Text color="white" fontSize={30} align="center">
                  Ride Tandem.
                </Text>
              </Box>
            </VStack>
          </HStack>
        </Center>
        <Center>
          <Box w="90vw" pt={10} pb={100}>
            <Text
              bgGradient={`linear(to-r, ${styleColors.medBlue}, ${styleColors.mainBlue})`}
              bgClip="text"
              fontWeight="extrabold"
              fontSize={50}
              align="center"
              mb={10}
            >
              Testimonials
            </Text>
            <Testimonial />
          </Box>
        </Center>
        <VStack pb={25}>
          <Text
            bgGradient={`linear(to-r, ${styleColors.medBlue}, ${styleColors.mainBlue})`}
            bgClip="text"
            fontWeight="extrabold"
            fontSize={50}
            align="center"
          >
            Pricing
          </Text>
          <Box pb={50}>
            <PriceSelector showSelectors={false} />
          </Box>
        </VStack>
        <Spacer />
      </Box>

      {/* Footer */}
      <Box bgColor="white" textAlign="center">
        <HStack p={4}>
          <Stack direction={{ base: "column", md: "row" }} align="center">
            <Image
              src={"/logo_darkBlue.svg"}
              alt="dark blue logo"
              objectFit="cover"
              maxW="50px"
            />
            <Text color={styleColors.darkBlue} p={1}>
              Tandem
            </Text>
          </Stack>
          <Spacer />
          <VStack align="center" marginRight={4} p={2}>
            <Text
              fontWeight={"bold"}
              color={styleColors.deepBlue}
              fontSize="70%"
            >
              Company
            </Text>
            <Text color={styleColors.deepBlue} fontSize="65%">
              About Us
            </Text>
            <Text color={styleColors.deepBlue} fontSize="65%">
              Contact Us
            </Text>
            <Text color={styleColors.deepBlue} fontSize="65%">
              Pricing
            </Text>
            <Text color={styleColors.deepBlue} fontSize="65%">
              Testimonials
            </Text>
          </VStack>
          <VStack align="center" marginLeft={2} marginRight={25} p={2}>
            <Text
              fontWeight={"bold"}
              color={styleColors.deepBlue}
              fontSize="70%"
            >
              Support
            </Text>
            <Text color={styleColors.deepBlue} fontSize="65%">
              Help Center
            </Text>
            <Text color={styleColors.deepBlue} fontSize="65%">
              Privacy Policy
            </Text>
            <Text color={styleColors.deepBlue} fontSize="65%">
              Legal
            </Text>
            <Text color={styleColors.deepBlue} fontSize="65%">
              Terms of Service
            </Text>
          </VStack>
          <Spacer />
        </HStack>
      </Box>
    </Box>
  );
};

export default ProductPage;
