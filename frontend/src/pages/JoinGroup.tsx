import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useObjectVal } from "react-firebase-hooks/database";
import { Group } from "./CreateGroup";
import { ref } from "firebase/database";
import { auth, db, DB_GROUP_COLLECT } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../components/Header";
import { NavConstants } from "../NavigationConstants";
import RideCard from "../components/RideCard";
import GroupJoinButton from "../components/GroupJoinButton";
import SignInRegisterButton from "../components/SignInRegister";

export type LocationGotoState = { goto?: string };
type GroupUserProps = { group: Group; userId: string | undefined };

const JoinGroup = () => {
  const groupId = useParams()["groupId"];
  const [user, loadingUser] = useAuthState(auth);
  const [group, loadingGroup, groupError] = useObjectVal<Group>(
    ref(db, `${DB_GROUP_COLLECT}/${groupId}`)
  );
  const navigate = useNavigate();
  if (!groupId) {
    console.log("Figure something better to do here.");
    navigate("/");
    return <></>;
  } else if (user && group?.members[user.uid]) {
    navigate(NavConstants.groupWithId(groupId));
  }

  return groupError ? (
    <Text> Error: {groupError}</Text>
  ) : loadingUser || loadingGroup ? (
    <Spinner />
  ) : group ? (
    <FoundGroup group={group} userId={user ? user.uid : undefined} />
  ) : (
    <GroupNotFound />
  );
};

const FoundGroup = (props: GroupUserProps) => {
  const rides = props.group.rides ? Object.keys(props.group.rides) : null;

  return (
    <>
      <Header />
      <Box>
        <Center>
          <VStack>
            <Heading>{props.group.name}</Heading>
            {!rides ? null : (
              <Box
                paddingBottom={2}
                paddingRight={2}
                paddingLeft={2}
                width={"100%"}
              >
                <RideCard rideId={rides[0]} viewOnly={true} />
              </Box>
            )}
            <Text>
              Members: {Object.keys(props.group?.members ?? {}).length}
            </Text>
            <JoinGroupOpts {...props} />
          </VStack>
        </Center>
      </Box>
    </>
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

const JoinGroupOpts = ({ group, userId }: GroupUserProps) => {
  const state: LocationGotoState = {
    goto: NavConstants.groupWithIdJoin(group.id),
  };

  return (
    <>
      {userId === undefined ? (
        <Box p={2}>
          Please sign in to join this group:
          <SignInRegisterButton state={state} />
        </Box>
      ) : (
        <Box p={2}>
          <GroupJoinButton group={group} userId={userId} />
        </Box>
      )}
    </>
  );
};

export default JoinGroup;
