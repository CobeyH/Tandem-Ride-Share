import {
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
} from "@chakra-ui/react";
import React from "react";
import { FaComment } from "react-icons/all";
import { GroupChat } from "./Chat";

const GroupDrawer = ({
  groupName,
  groupId,
}: {
  groupName: string;
  groupId: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        aria-label="group-members"
        rightIcon={<FaComment />}
        size="sm"
        onClick={onOpen}
        id="chat"
      >
        Chat
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        blockScrollOnMount={false}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>{groupName}</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody p={0} overflow="hidden" mb={2}>
            <GroupChat groupId={groupId} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default GroupDrawer;
