import { Badge, HStack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getUser, User } from "../../firebase/database";

const GroupMembersList = (props: {
  members: { [key: string]: boolean };
  ownerId: string | undefined;
  maxSize: number;
  groupId: string;
  isOpen: boolean;
}) => {
  const [groupMembers, setGroupMembers] = useState<User[]>();

  const fetchUsers = () => {
    const userPromises = Object.keys(props.members).map((userId) => {
      return getUser(userId);
    });
    Promise.all(userPromises).then((users) => setGroupMembers(users));
  };

  useEffect(() => {
    fetchUsers();
  }, [props.isOpen]);

  return (
    <>
      {groupMembers
        ?.filter((user) => user.uid === props.ownerId)
        .map((user: User, i) => (
          <HStack key={i}>
            <Text>{user?.name}</Text>
            <Badge colorScheme={"blue"}>Owner</Badge>
          </HStack>
        ))}
      {groupMembers
        ?.filter((user) => user.uid !== props.ownerId)
        .map((user: User, i) => (
          <HStack key={i}>
            <Text>{user?.name}</Text>
          </HStack>
        ))}
    </>
  );
};

export default GroupMembersList;
