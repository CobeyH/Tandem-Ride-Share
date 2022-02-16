import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Text,
  Box,
  Button,
  Center,
  Heading,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useObjectVal } from "react-firebase-hooks/database";
import { Group } from "./CreateGroup";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../components/Header";
import { NavConstants } from "../NavigationConstants";

export type LocationGotoState = { goto?: string };

const JoinGroup = () => {
  const groupId = useParams()["groupId"];
  const [user, loadingUser] = useAuthState(auth);
  const [group, loadingGroup, groupError] = useObjectVal<Group>(
    ref(db, `groups/${groupId}`)
  );
  const navigate = useNavigate();
  if (!groupId) {
    console.log("Figure something better to do here.");
    navigate("/");
    return <></>;
  } else if (!user) {
    const state: LocationGotoState = {
      goto: NavConstants.groupWithIdJoin(groupId),
    };
    navigate("/register", { state });
    return <></>; // return here to let typescript know from here on in user is not null
  }

  return groupError ? (
    <Text> Error: {groupError}</Text>
  ) : loadingUser || loadingGroup ? (
    <Spinner />
  ) : group ? (
    <FoundGroup group={group} userId={user.uid} />
  ) : (
    <GroupNotFound />
  );
};

const FoundGroup = ({ group, userId }: { group: Group; userId: string }) => {
  const navigate = useNavigate();

  return (
    <Center>
      <Stack>
        <Header />
        <Heading>{group.name}</Heading>
        <Box>
          <Center>
            <Stack>
              <Text>Members: {group?.members?.length ?? 0}</Text>
              <Button
                onClick={() => {
                  set(
                    ref(db, `groups/${group.id}/members/${userId}`),
                    true
                  ).then(() => {
                    navigate(`/group/${group.id}`);
                  });
                }}
              >
                Join
              </Button>
            </Stack>
          </Center>
        </Box>
      </Stack>
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

export default JoinGroup;
