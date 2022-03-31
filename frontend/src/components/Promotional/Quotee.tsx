import {
  Box,
  BoxProps,
  Center,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { FaUserCircle } from "react-icons/fa";
import { styleColors } from "../../theme/colours";

interface Props extends BoxProps {
  name: string;
  jobTitle: string;
}

export const Quotee = (props: Props) => {
  const { name, jobTitle, ...boxProps } = props;
  return (
    <Box {...boxProps}>
      <Center>
        <FaUserCircle color={styleColors.medGreen} size={70}></FaUserCircle>
      </Center>
      <Box mt="3">
        <Text
          as="cite"
          color={useColorModeValue("${styleColors.deepBlue}", "white")}
          fontStyle="normal"
          fontWeight="bold"
        >
          {name}
        </Text>
        <Text
          fontSize="sm"
          fontWeight="medium"
          color={useColorModeValue(
            "${styleColors.darkBlue}",
            "${styleColors.paleBlue}"
          )}
        >
          {jobTitle}
        </Text>
      </Box>
    </Box>
  );
};
