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
import { auth, db, DB_GROUP_COLLECT } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../components/Header";
import { NavConstants } from "../NavigationConstants";
import RideCard from "../components/RideCard";
import GroupJoinButton from "../components/GroupJoinButton";

export type LocationGotoState = { goto?: string };

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
  } else if (!user) {
    const state: LocationGotoState = {
      goto: NavConstants.groupWithIdJoin(groupId),
    };
    navigate("/register", { state });
    return <></>; // return here to let typescript know from here on in user is not null
  } else if (group?.members[user.uid]) {
    navigate(NavConstants.groupWithId(groupId));
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
  const rides = group.rides ? Object.keys(group.rides) : null;

  return (
    <>
      <Header />
      <Box>
        <Center>
          <VStack>
            <Heading>{group.name}</Heading>
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
            <Text>Members: {Object.keys(group?.members ?? {}).length}</Text>
            <GroupJoinButton group={group} userId={userId} />
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

export default JoinGroup;
