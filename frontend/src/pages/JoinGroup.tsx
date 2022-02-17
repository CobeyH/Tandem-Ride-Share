import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import { Group } from "./CreateGroup";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../components/Header";
import { NavConstants } from "../NavigationConstants";
import MapView, { findMidpoint } from "../components/MapView";
import { Ride } from "./CreateRide";

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
  const navigate = useNavigate();
  const [map, setMap] = useState<L.Map | undefined>(undefined);
  const [rides, loadingRides, ridesLoadError] = useListVals<Ride>(
    ref(db, `rides/${group.id}`)
  );

  useEffect(() => {
    map?.invalidateSize();
  }, [map]);

  return (
    <>
      <Header />
      <Box>
        <Center>
          <VStack>
            <Heading>{group.name}</Heading>
            {loadingRides ? (
              <Spinner />
            ) : ridesLoadError || rides === [] || !rides ? null : (
              <Box
                paddingBottom={2}
                paddingRight={2}
                paddingLeft={2}
                width={"100%"}
              >
                <Center>
                  <Heading size={"sm"} padding={2}>
                    {rides[0].name}
                  </Heading>
                </Center>
                <AspectRatio ratio={1} width={"100%"}>
                  <MapView
                    setMap={setMap}
                    center={
                      findMidpoint(
                        rides[0].start,
                        rides[0].end
                      ) /* we know rides is non-empty*/
                    }
                  />
                </AspectRatio>
              </Box>
            )}

            <Text>Members: {Object.keys(group?.members ?? {}).length}</Text>
            <Button
              onClick={() => {
                set(ref(db, `groups/${group.id}/members/${userId}`), true).then(
                  () => {
                    navigate(`/group/${group.id}`);
                  }
                );
              }}
            >
              Join
            </Button>
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
