import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";

export interface CardProps extends BoxProps {
  isPopular?: boolean;
}

export const Card = (props: CardProps) => {
  const { children, isPopular, ...rest } = props;
  return (
    <Box
      bg={useColorModeValue("white", "gray.700")}
      position="relative"
      px="6"
      pb="6"
      pt="16"
      overflow="hidden"
      shadow="lg"
      maxW="md"
      width="100%"
      {...rest}
    >
      {children}
    </Box>
  );
};
