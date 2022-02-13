import { Flex, Button } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { logout, auth } from "../firebase";

const Header = () => {
  return (
    <Flex
      width="100%"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      bg="teal.500"
      color="white"
    >
      <ColorModeSwitcher justifySelf="flex-end" />
      <LogoutButton />
    </Flex>
  );
};

const LogoutButton = () => {
  const [user] = useAuthState(auth);
  if (user) {
    return <Button onClick={logout}>Logout</Button>;
  }
  return null;
};

export default Header;
