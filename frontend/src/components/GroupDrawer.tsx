import {
  useDisclosure,
  Button,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
  Icon,
  DrawerHeader,
  Divider,
  HStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsFillChatFill } from "react-icons/all";
import { lightTheme } from "../theme/colours";
import { GroupChat } from "./Chat";
import GroupMembersList from "./GroupMembersList";

enum mode {
  Chat,
  Members,
}

const GroupDrawer = (props: {
  members: { [key: string]: boolean };
  ownerId: string | undefined;
  maxSize: number;
  groupId: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currMode, setCurrMode] = useState<mode>(mode.Chat);

  const renderMode = () => {
    switch (currMode) {
      case mode.Chat:
        return <GroupChat groupId={props.groupId} />;
      case mode.Members:
        return <GroupMembersList {...props} isOpen={isOpen} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        aria-label="group-members"
        rightIcon={<Icon as={BsFillChatFill} />}
        size="sm"
        onClick={onOpen}
      >
        Chat
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack pt={5}>
              <Box
                w="50%"
                borderRadius={5}
                as="button"
                bg={currMode === mode.Chat ? lightTheme.lightButton : "white"}
                onClick={() => setCurrMode(mode.Chat)}
              >
                Group Chat
              </Box>
              <Divider orientation="vertical" />
              <Box
                w="50%"
                borderRadius={5}
                bg={
                  currMode === mode.Members ? lightTheme.lightButton : "white"
                }
                as="button"
                onClick={() => setCurrMode(mode.Members)}
              >
                Members
              </Box>
            </HStack>
          </DrawerHeader>

          <DrawerBody>{renderMode()}</DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default GroupDrawer;
