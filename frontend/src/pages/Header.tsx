import {
  BreadcrumbItem,
  Breadcrumb,
  BreadcrumbLink,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { ColorModeSwitcher } from "../ColorModeSwitcher";

const breadcrumbs = () => {
  const [user] = useAuthState(auth);
  if (user) {
    return (
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href="#">Docs</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">Breadcrumb</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }
};

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
