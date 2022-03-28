import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { styleColors } from "../../theme/colours";

interface CardProps extends BoxProps {
  highlight: boolean;
}

export const Card = (props: CardProps) => {
  const { children, highlight, ...rest } = props;
  return (
    <Box
      bg={useColorModeValue("white", styleColors.charcoal)}
      position="relative"
      px="6"
      pb="6"
      pt="16"
      overflow="hidden"
      shadow="lg"
      maxW="md"
      width="100%"
      borderColor={highlight ? styleColors.green : undefined}
      borderWidth={3}
      {...rest}
    >
      {children}
    </Box>
  );
};
