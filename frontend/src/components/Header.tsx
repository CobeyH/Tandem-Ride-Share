import {
  Flex,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spacer,
  Box,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { logout, auth } from "../firebase";

export interface PageList {
  pages?: { label: string; url: string }[];
}

const Header = (props: PageList) => {
  const [user] = useAuthState(auth);
  return (
    <Flex
      width="100%"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      bg="teal.500"
      marginBlockEnd={4}
      color="white"
    >
      <Breadcrumbs pages={props.pages} />
      <Spacer />
      <ColorModeSwitcher justifySelf="flex-end" />
      <Box px={5}>{user?.displayName}</Box>
      {user ? <LogoutButton /> : null}
    </Flex>
  );
};

const Breadcrumbs = (props: PageList) => {
  if (!props || !props.pages || props.pages.length <= 0) {
    return null;
  }
  const items = props.pages.map((p, i) => {
    return (
      <BreadcrumbItem key={i}>
        <BreadcrumbLink as={Link} to={p.url}>
          {p.label}
        </BreadcrumbLink>
      </BreadcrumbItem>
    );
  });
  return <Breadcrumb>{items}</Breadcrumb>;
};

const LogoutButton = () => {
  return <Button onClick={logout}>Logout</Button>;
};

export default Header;
