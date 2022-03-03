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
} from "@chakra-ui/react";
import { child, get, ref } from "firebase/database";
import * as React from "react";
import { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { db } from "../firebase/firebase";
import { DBConstants, User } from "../firebase/database";

const GroupMembersList = (props: {
  members: { [key: string]: boolean };
  ownerId: string | undefined;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupMembers, setGroupMembers] = useState<User[]>();

  const fetchUsers = () => {
    const userRef = ref(db, DBConstants.USERS);
    const queryPromises = Object.keys(props.members).map((userId) => {
      return get(child(userRef, `${userId}`));
    });
    Promise.all(queryPromises).then((snapshots) => {
      const members = snapshots.map((user) => user.val());
      setGroupMembers(members);
    });
  };

  React.useEffect(() => {
    fetchUsers();
  }, [isOpen]);

  return (
    <>
      <IconButton
        aria-label="group-members"
        icon={<Icon as={FaUserFriends} />}
        w={6}
        h={6}
        onClick={onOpen}
      >
        Open
      </IconButton>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

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
