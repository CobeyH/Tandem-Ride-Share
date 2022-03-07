import {
  useDisclosure,
  Button,
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
} from "@chakra-ui/react";
import React from "react";
import { FaUserFriends } from "react-icons/fa";
import { GroupChat } from "./Chat";
import GroupMembersList from "./GroupMembersList";

const GroupDrawer = (props: {
  members: { [key: string]: boolean };
  ownerId: string | undefined;
  maxSize: number;
  groupId: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <DrawerHeader>Group Members</DrawerHeader>

          <DrawerBody>
            <GroupMembersList {...props} isOpen={isOpen} />
            <Divider />
            <Heading>Group Chat</Heading>
            <GroupChat groupId={props.groupId} />
          </DrawerBody>

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
