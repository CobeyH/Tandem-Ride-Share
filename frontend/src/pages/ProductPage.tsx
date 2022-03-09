import { AspectRatio, Box, Image } from "@chakra-ui/react";
import { ref } from "firebase/storage";
import * as React from "react";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { storage } from "../firebase/storage";

const ProductPage = () => {
  const logoWhite = ref(storage, "Logos/Logo_White.png");
  const [profilePic, profilePicLoading] = useDownloadURL(logoWhite);
  return (
    <Box bg="blue.100" w="100%" p={10} textAlign="center">
      <AspectRatio maxW="400px" ratio={1 / 1}>
        <Image src={profilePic} alt="white logo" objectFit="cover" />
      </AspectRatio>
      Tandem
    </Box>
  );
};

export default ProductPage;
