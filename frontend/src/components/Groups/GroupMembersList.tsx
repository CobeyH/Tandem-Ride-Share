import { Heading, Badge, HStack, Text } from "@chakra-ui/react";
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
      {groupMembers?.map((user: User, i) => (
        <HStack key={i}>
          <Heading size="md">{user?.name}</Heading>
          {user?.uid === props.ownerId ? (
            <Badge colorScheme={"blue"}>Owner</Badge>
          ) : null}
        </HStack>
      ))}
      <Text pl={5} align="right">
        {Object.keys(props.members).length} / {props.maxSize}
      </Text>
    </>
  );
};

export default GroupMembersList;
