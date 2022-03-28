import {
  Flex,
  Button,
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
  IconButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { logout, auth } from "../firebase/firebase";
import { FaHome, MdEmail } from "react-icons/all";
import { User } from "firebase/auth";
import AddCar from "./Profiles/AddCar";
import { lightTheme } from "../theme/colours";
import ManageCars from "./Profiles/ManageCars";
import { useNavigate } from "react-router-dom";

const Header = ({ isNested }: { isNested?: boolean }) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  return (
    <Flex
      width="100%"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      bg={lightTheme.main}
    >
      {isNested ? (
        <IconButton
          onClick={() => navigate("/")}
          aria-label="home"
          icon={<FaHome />}
        />
      ) : null}
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

export default Header;
