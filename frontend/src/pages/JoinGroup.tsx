import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Text, Box, Button, Center, Heading, Spinner } from "@chakra-ui/react";
import { useObjectVal } from "react-firebase-hooks/database";
import { Group } from "./CreateGroup";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const FoundGroup = ({ group, userId }: { group: Group; userId: string }) => {
  const navigate = useNavigate();

  return (
    <Center>
      <Box>
        <Button
          onClick={() => {
            set(ref(db, `groups/${group.id}/members/${userId}`), true).then(
              () => {
                navigate(`/group/${group.id}`);
              }
            );
          }}
        >
          Join {group.name}
        </Button>
        <Text>Members: {group?.members?.length ?? 0}</Text>
      </Box>
    </Center>
  );
};

const GroupNotFound = () => {
  const navigate = useNavigate();

  return (
    <Center>
      <Box>
        <Heading>Group not found</Heading>
        <Button onClick={() => navigate("/group")}>Groups</Button>
      </Box>
    </Center>
  );
};

const JoinGroup = () => {
  const groupId = useParams()["groupId"];
  const [user, loadingUser] = useAuthState(auth);
  console.log(`groups/${groupId}`);
  const [group, loadingGroup, groupError] = useObjectVal<Group>(
    ref(db, `groups/${groupId}`)
  );
  const navigate = useNavigate();
  if (groupId === undefined) {
    console.log("Figure something better to do here.");
    navigate("/");
  }

  return groupError ? (
    <Text>Error: {groupError}</Text>
  ) : loadingUser || loadingGroup ? (
    <Spinner />
  ) : group && user ? (
    <FoundGroup group={group} userId={user.uid} />
  ) : (
    <GroupNotFound /> // user could also not be found, but in that case they should be kicked back to login.
  );
};

export default JoinGroup;
