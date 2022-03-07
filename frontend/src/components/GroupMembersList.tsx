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
  Badge,
  HStack,
  DrawerHeader,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { getUser, User } from "../firebase/database";

const GroupMembersList = (props: {
  members: { [key: string]: boolean };
  ownerId: string | undefined;
  maxSize: number;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupMembers, setGroupMembers] = useState<User[]>();

  const fetchUsers = () => {
    const userPromises = Object.keys(props.members).map((userId) => {
      return getUser(userId);
    });
    Promise.all(userPromises).then((users) => setGroupMembers(users));
  };

  useEffect(() => {
    fetchUsers();
  }, [isOpen]);

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
          <Text pl={5}>
            {Object.keys(props.members).length} / {props.maxSize}
          </Text>

          <DrawerBody>
            {groupMembers?.map((user: User, i) => (
              <HStack key={i}>
                <Heading size="md">{user?.name}</Heading>
                {user?.uid === props.ownerId ? (
                  <Badge colorScheme={"blue"}>Owner</Badge>
                ) : null}
              </HStack>
            ))}
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

export default GroupMembersList;
