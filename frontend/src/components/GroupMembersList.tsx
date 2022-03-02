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
  Icon,
} from "@chakra-ui/react";
import { child, get, ref } from "firebase/database";
import * as React from "react";
import { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { db, DB_USER_COLLECT } from "../firebase";

const GroupMembersList = (props: {
  members: { [key: string]: boolean };
  ownerId: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupMembers, setGroupMembers] = useState<string[]>();

  const fetchUsers = () => {
    const userRef = ref(db, DB_USER_COLLECT);
    const queryPromises = Object.keys(props.members).map((userId) => {
      return get(child(userRef, `${userId}`));
    });
    Promise.all(queryPromises).then((users) => {
      const userNames = users.map((user) => user.val().name);
      setGroupMembers(userNames);
    });
  };

  React.useEffect(() => {
    fetchUsers();
  }, [isOpen]);

  return (
    <>
      <Icon as={FaUserFriends} w={6} h={6} focusable={true} onClick={onOpen}>
        Open
      </Icon>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody>
            {groupMembers?.map((userName, i) => (
              <Heading size="md" key={i}>
                {userName}
              </Heading>
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
