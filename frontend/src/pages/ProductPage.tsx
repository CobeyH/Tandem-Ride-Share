import {
  Box,
  Text,
  HStack,
  Image,
  Spacer,
  Center,
  VStack,
  Grid,
  GridItem,
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
      bgGradient={`linear(to-r, ${styleColors.mainBlue}, ${styleColors.lightBlue})`}
    >
      <ProductHeader />
      <Box
        h="-webkit-fit-content"
        bgGradient={`linear(transparent 30%, white)`}
        ml={5}
      >
        <Center>
          <HStack pt={{ base: 75, md: 175 }} pb={125}>
            <VStack align="center">
              <VStack align="left">
                <Text
                  color={styleColors.deepBlue}
                  fontSize={30}
                  fontWeight={600}
                >
                  Carpooling made easy.
                </Text>
                <Text
                  color={styleColors.deepBlue}
                  fontSize={30}
                  fontWeight={600}
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
          <Box w="90vw" pt={10} pb={200}>
            <Text
              bgGradient={`linear(to-r, ${styleColors.darkBlue}, ${styleColors.medBlue}, white)`}
              bgClip="text"
              fontWeight="extrabold"
              fontSize={50}
              align="center"
            >
              Testimonials
            </Text>
            <Grid
              w="90vw"
              templateRows="repeat(2, 1fr)"
              templateColumns="repeat(5, 1fr)"
              gap={4}
            >
              <GridItem rowSpan={2} colSpan={1}>
                <Testimonial></Testimonial>
              </GridItem>
              <GridItem colSpan={2}>
                <Testimonial></Testimonial>
              </GridItem>
              <GridItem colSpan={2}>
                <Testimonial></Testimonial>
              </GridItem>
              <GridItem colSpan={4}>
                <Testimonial></Testimonial>
              </GridItem>
            </Grid>
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
            <PriceSelector />
          </Box>
        </VStack>
        <Spacer />
        <Box w="100vw" bgColor="white" textAlign="center">
          <HStack p={4}>
            <Image
              src={"/logo_darkBlue.svg"}
              alt="dark blue logo"
              objectFit="cover"
              maxW="50px"
            />
            <Text color={styleColors.darkBlue} fontSize="100%" p={1}>
              Tandem
            </Text>
            <Spacer />
            <VStack align="center" pr={100}>
              <b>
                <Text color={styleColors.deepBlue} fontSize="70%">
                  Company
                </Text>
              </b>
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
            <VStack pr={200}>
              <b>
                <Text color={styleColors.deepBlue} fontSize="70%">
                  Support
                </Text>
              </b>
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
    </Box>
  );
};

export default ProductPage;
