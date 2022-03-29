import * as React from "react";
import { Text, Image, Badge } from "@chakra-ui/react";
import { styleColors } from "../../theme/colours";

const LogoName = () => {
  return (
    <>
      <Image
        src={"/logo_white.svg"}
        objectFit="cover"
        maxW={{ base: "50px", md: "70px" }}
      />
      <Text color="white" fontSize={{ base: 20, md: 30 }} p={1}>
        Tandem
      </Text>
      <Badge bg={styleColors.medBlue} borderRadius={4}>
        Beta
      </Badge>
    </>
  );
};

export default LogoName;
