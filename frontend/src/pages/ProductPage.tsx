import {
  AspectRatio,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import { ref } from "firebase/storage";
import * as React from "react";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { useNavigate } from "react-router-dom";
import PriceSelector from "../components/Promotional/PriceSelector";
import { storage } from "../firebase/storage";
import { NavConstants } from "../NavigationConstants";

const ProductPage = () => {
  const logoRef = ref(storage, "Logos/Logo_White.png");
  const [logo, logoLoading] = useDownloadURL(logoRef);
  const navigate = useNavigate();
  return (
    <>
      <Box bg="blue.100" w="100%" p={10} textAlign="center">
        <HStack>
          <Spacer />
          <Button onClick={() => navigate(NavConstants.LOGIN)}>Login</Button>
          <Button onClick={() => navigate(NavConstants.REGISTER)}>
            Register
          </Button>
        </HStack>
        <Heading>Tandem</Heading>
      </Box>

      {logoLoading ? (
        <Spinner />
      ) : (
        <AspectRatio maxW="30%" ratio={1 / 1}>
          <Image src={logo} alt="white logo" objectFit="cover" />
        </AspectRatio>
      )}
      <PriceSelector />
    </>
  );
};

export default ProductPage;
