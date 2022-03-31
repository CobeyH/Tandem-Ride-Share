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
  Tooltip,
  ModalOverlay,
  Text,
  ModalFooter,
  useDisclosure,
  Link,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { logout, auth } from "../firebase/firebase";
import { MdEmail, FaBug, FaBars } from "react-icons/all";
import { User } from "firebase/auth";
import AddCar from "./Profiles/AddCar";
import { styleColors } from "../theme/colours";
import ManageCars from "./Profiles/ManageCars";
import { useNavigate } from "react-router-dom";
import { Step } from "react-joyride";
import Tutorial from "./Tutorial";
import LogoName from "./Promotional/LogoName";
import { useUser } from "../firebase/database";

const Header = ({ tutorialSteps }: { tutorialSteps?: Array<Step> }) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  return (
    <Flex
      width="100%"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={{ base: 3, md: 4, lg: 6, xl: 8 }}
      bg={styleColors.mainBlue}
    >
      <Button
        id="home"
        onClick={() => navigate("/welcome")}
        aria-label="home"
        variant="ghost"
        p={0}
      >
        <LogoName />
      </Button>
      <Spacer />
      {tutorialSteps ? <Tutorial steps={tutorialSteps} /> : null}
      {user ? (
        <Menu>
          <ReportBug />
          <MenuButton
            as={IconButton}
            fontSize={{ base: 14, md: 16 }}
            aria-label={"menu"}
            icon={<FaBars />}
            varient="ghost"
            bg="transparent"
            _hover={{ bg: "whiteAlpha.200" }}
            color="white"
            ml="2"
          />
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
  const [userData] = useUser(user.uid);
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
            {userData?.name}
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

const ReportBug = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  return (
    <>
      <Tooltip hasArrow label="Report a Bug" bg="gray.300" color="black">
        <IconButton
          mr="4"
          variant="ghost"
          aria-label="report a bug"
          color="white"
          icon={<FaBug />}
          onClick={onOpen}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report a Bug</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Did you find a bug? Please report to us so we can make your
              experience better!
            </Text>
            <br />
            <Text>
              You can reach out to our support team via{" "}
              <Link
                color={styleColors.mainBlue}
                onClick={() => {
                  navigator.clipboard
                    .writeText("CobeyHollier@gmail.com")
                    .then(() => {
                      toast({
                        title: "Copied Email to Clipboard",
                        status: "success",
                        isClosable: true,
                      });
                    });
                }}
              >
                email
              </Link>{" "}
            </Text>
            <br />
            <Text>
              Please provide as much context as possible. For example, the page
              you were in, the function you were using, etc
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Header;
