import {
  Flex,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spacer,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  ModalCloseButton,
  Box,
  HStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { logout, auth } from "../firebase/firebase";
import { MdEmail } from "react-icons/all";
import { User } from "firebase/auth";
import AddCar from "./Profiles/AddCar";
import { lightTheme, styleColors } from "../theme/colours";
import ManageCars from "./Profiles/ManageCars";

export interface PageList {
  pages?: { label: string; url: string }[];
}

const Header = ({ pages }: PageList) => {
  const [user] = useAuthState(auth);

  return (
    <Flex
      width="100%"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      bg={lightTheme.main}
    >
      <Breadcrumbs pages={pages} />
      <HStack>
        {pages?.map((page: { label: string; url: string }) => {
          return (
            <Box
              color="white"
              display="block"
              background={styleColors.periwinkle}
              textDecor="none"
              position="relative"
              height="40px"
              line-height="40px"
              pr="10px"
              pl="5px"
              text-align="center"
              mr="23px"
              key={page.label}
              _even={{
                background: styleColors.darkBlue,
                _before: {
                  borderColor: styleColors.darkBlue,
                  borderLeftColor: "transparent",
                },
                _after: {
                  borderLeftColor: styleColors.darkBlue,
                },
              }}
              _before={{
                left: "-20px",
                borderLeftColor: "transparent",
              }}
              _after={{
                content: '""',
                position: "absolute",
                top: 0,
                borderWidth: "20px",
                width: 0,
                height: 0,
                left: "100%",
                borderColor: "transparent",
                borderColorLeft: styleColors.darkBlue,
              }}
            >
              {page.label}
            </Box>
          );
        })}
      </HStack>
      <Spacer />
      {user ? (
        <Menu>
          <MenuButton as={Button}>Profile</MenuButton>
          <MenuList zIndex={3}>
            <Settings user={user} />
            <AddCar user={user} />
            <ManageCars user={user} />
            <MenuDivider />
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <ColorModeSwitcher float={"right"} />
      )}
    </Flex>
  );
};

const Settings = (props: { user: User }) => {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const user = props.user;
  return (
    <MenuItem onClick={() => setUserModalOpen(true)}>
      Settings
      <Modal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        isCentered={true}
      >
        <ModalContent h={"container.sm"} padding={"4"} w={"95%"}>
          <ModalCloseButton />
          <ModalHeader>
            {user?.displayName}
            <ColorModeSwitcher float={"right"} />
          </ModalHeader>
          <ModalBody>
            {user?.email ? (
              <Flex>
                <MdEmail style={{ margin: 5 }} /> {user.email}
              </Flex>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </MenuItem>
  );
};

const Breadcrumbs = ({ pages }: PageList) => {
  if (pages === undefined || pages.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      {pages.map((p, i) => (
        <BreadcrumbItem key={i}>
          <BreadcrumbLink as={Link} to={p.url}>
            {p.label}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default Header;
