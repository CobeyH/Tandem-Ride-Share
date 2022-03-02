import {
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Heading,
} from "@chakra-ui/react";
import { child, get, ref } from "firebase/database";
import * as React from "react";
import { useState } from "react";
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
      <Button onClick={onOpen}>Open</Button>
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
