import { Flex } from "@chakra-ui/react";
import React from "react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";

const Header = () => {
  return (
    <Flex
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      bg="teal.500"
      color="white"
    >
      <ColorModeSwitcher justifySelf="flex-end" />
    </Flex>
  );
};

export default Header;
