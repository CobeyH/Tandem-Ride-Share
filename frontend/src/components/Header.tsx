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
  ModalFooter,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { logout, auth } from "../firebase";
import { MdEmail } from "react-icons/all";

export interface PageList {
  pages?: { label: string; url: string }[];
}

const Header = ({ pages }: PageList) => {
  const [user] = useAuthState(auth);
  const [userModalOpen, setUserModalOpen] = useState(false);

  return (
    <Flex
      width="100%"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      marginBlockEnd={4}
    >
      <Breadcrumbs pages={pages} />
      <Spacer />
      <Menu>
        <MenuButton as={Button}>Profile</MenuButton>
        <MenuList>
          <MenuItem onClick={() => setUserModalOpen(true)}>
            My Account
            {user ? (
              <Modal
                isOpen={userModalOpen}
                onClose={() => setUserModalOpen(false)}
                isCentered={true}
              >
                <ModalContent h={"container.sm"} padding={"4"} w={"95%"}>
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
            ) : (
              <ColorModeSwitcher float={"right"} />
            )}
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={logout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
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
