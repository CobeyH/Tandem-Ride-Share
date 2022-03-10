import {
  AspectRatio,
  Box,
  Button,
  Heading,
  Text,
  HStack,
  Image,
  Spacer,
  Spinner,
  Center,
  VStack,
  Fade,
  SimpleGrid,
} from "@chakra-ui/react";
import { ref } from "firebase/storage";
import * as React from "react";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { useNavigate } from "react-router-dom";
import PriceSelector from "../components/Promotional/PriceSelector";
import { Testimonal as Testimonial } from "../components/Promotional/Testimonial";
import { storage } from "../firebase/storage";
import { NavConstants } from "../NavigationConstants";
import { lightTheme, styleColors } from "../theme/colours";

const ProductPage = () => {
  const logoRef = ref(storage, "promotional/logo_white.svg");
  const [logo, logoLoading] = useDownloadURL(logoRef);
  const navigate = useNavigate();
  return (
    <>
      <Box
        w="100vw"
        h="200vh"
        bgGradient={`linear(to-r, ${styleColors.mainBlue}, white)`}
      >
        <Box bg={lightTheme.main} w="100%" p={4} textAlign="center">
          <HStack>
            {logoLoading ? (
              <Spinner />
            ) : (
              <Image
                src={logo}
                alt="white logo"
                objectFit="cover"
                maxW="70px"
              />
            )}
            <Text color="white" fontSize={40} p={1}>
              Tandem
            </Text>
            <Spacer />
            <Text color="white" p={4} fontWeight={400}>
              Features and Benefits
            </Text>

            <Text color="white" p={4} fontWeight={400}>
              Pricing
            </Text>

            <Text color="white" p={4} fontWeight={400}>
              Help
            </Text>
            <Button
              variant="tandem-product"
              p={4}
              onClick={() => navigate(NavConstants.REGISTER)}
            >
              Register Now
            </Button>
            <Button
              variant="tandem-product"
              p={4}
              onClick={() => navigate(NavConstants.LOGIN)}
            >
              Login
            </Button>
          </HStack>
        </Box>
        <Center>
          <HStack p={100}>
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
              <Text color="white" fontSize={18} align="center">
                Connect your circles and get where you need to go together.
              </Text>
            </VStack>
          </HStack>
        </Center>
        <Testimonial></Testimonial>
        <PriceSelector />
        <Spacer />
        <HStack>
          {logoLoading ? (
            <Spinner />
          ) : (
            <Image src={logo} alt="white logo" objectFit="cover" maxW="70px" />
          )}
        </HStack>
      </Box>
    </>
  );
};

export default ProductPage;
