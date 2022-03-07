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
  Heading,
  IconButton,
  Icon,
  DrawerHeader,
  Divider,
  HStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
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
        return (
          <>
            <Heading>Group Chat</Heading>
            <GroupChat groupId={props.groupId} />;
          </>
        );
      case mode.Members:
        return (
          <>
            <Heading>Group Members</Heading>
            <GroupMembersList {...props} isOpen={isOpen} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <IconButton
        aria-label="group-members"
        icon={<Icon as={FaUserFriends} />}
        size="sm"
        onClick={onOpen}
      >
        Open
      </IconButton>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack>
              <Box as="button" onClick={() => setCurrMode(mode.Chat)}>
                Group Chat
              </Box>
              <Divider orientation="vertical" />
              <Box as="button" onClick={() => setCurrMode(mode.Members)}>
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
