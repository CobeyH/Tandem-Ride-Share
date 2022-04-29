import * as React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Group, useGroup } from "../firebase/database";
import { Val } from "react-firebase-hooks/database/dist/database/types";
import RideCard from "../components/Rides/RideCard";
import Header from "../components/Header";
import { storage } from "../firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { ref as storageRef } from "firebase/storage";
import ShareLink from "../components/Groups/ShareLink";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import GroupInfo from "../components/Groups/GroupInfo";
import GroupDrawer from "../components/Groups/GroupDrawer";
import GroupSelector from "../components/Groups/GroupSelector";
import { LoadingPage } from "../App";
import GroupAvatar from "../components/Groups/GroupAvatar";
import { useState } from "react";

const tutorialSteps = [
  {
    target: "#share-link",
    content:
      "The share link button can be used to invite other people to your group.",
    disableBeacon: true,
  },
  {
    target: "#chat",
    content: "You can chat with other group members to discuss your rides.",
  },
  {
    target: "#active-rides",
    content: "You can also view the rides that are taking place in the future.",
  },
  {
    target: "#prev-rides",
    content:
      "The previous rides toggle shows an archive of the rides that have already occured.",
  },
  {
    target: "#new-ride",
    content: "You can also setup your own ride that others can join.",
  },
];

export default function GroupPage() {
  const navigate = useNavigate();
  const groupId = useParams()["groupId"];
  if (groupId === undefined) {
    console.log("figure something better to do here");
    navigate("/");
    return null;
  }
  const [group, loading, error] = useGroup(groupId);

  return (
    <>
      <Header tutorialSteps={tutorialSteps} />
      <HStack alignItems="flex-start" spacing={0}>
        <GroupSelector />
        {loading ? (
          <LoadingPage />
        ) : error ? (
          <Text>{JSON.stringify(error)}</Text>
        ) : group ? (
          <SingleGroup group={group} />
        ) : (
          <Text>No such group exists</Text>
        )}
      </HStack>
    </>
  );
}

const SingleGroup = ({ group }: { group: Val<Group> }) => {
  const navigate = useNavigate();
  const bannerRef = group.banner
    ? storageRef(storage, group.banner)
    : undefined;
  const [banner, bannerLoading, error] = useDownloadURL(bannerRef);
  const [user] = useAuthState(auth);
  const [showPrev, setShowPrev] = useState(false);

  return (
    <Box flexGrow={1} w="100%">
      {bannerLoading || error ? (
        <Box h="10%" w="100%" maxHeight="150" minHeight="100" />
      ) : (
        <Image
          src={banner}
          h="10%"
          w="100%"
          maxHeight="150"
          objectFit="cover"
          data-cy="group-banner"
        />
      )}

      <Container mb={4}>
        <VStack spacing="24px" justifyContent={"center"}>
          <GroupAvatar group={group} index={0} mt={10} size="xl" />
          <Heading textAlign={"center"} mt={5} data-cy="group-name">
            {group.name}
          </Heading>
          <HStack mt={5} align="center" spacing={5}>
            <ShareLink user={user} />
            <GroupDrawer groupName={group.name} groupId={group.id} />
            {
              user ? (
                <GroupInfo group={group} userId={user.uid} />
              ) : null /*User should really never be null here. */
            }
          </HStack>
          {group.description && group.description.length > 0 ? (
            <Box py={5} textAlign="left" w="100%">
              {group.description}
            </Box>
          ) : null}
          <Box w="100%" pt={5}>
            <Text
              id="active-rides"
              textAlign="left"
              fontWeight="bold"
              fontSize="22"
            >
              Active Rides
            </Text>
            <HStack justifyContent={"flex-start"} w="100%">
              <Text fontSize={12}>Show Completed</Text>
              <Switch
                id="prev-rides"
                isChecked={showPrev}
                onChange={(e) => setShowPrev(e.target.checked)}
                size="sm"
                data-cy="show-complete-rides"
              />
            </HStack>
          </Box>
          {group.rides ? (
            Object.keys(group.rides).map((key) => (
              <RideCard key={key} rideId={key} isActive={true} />
            ))
          ) : (
            <Text>There are no currently active rides...</Text>
          )}
          {group.rides && showPrev
            ? Object.keys(group.rides).map((key) => (
                <RideCard key={key} rideId={key} isActive={false} />
              ))
            : null}
          <Button
            fontWeight="normal"
            id="new-ride"
            onClick={() => {
              navigate(`/group/${group.id}/ride/new`);
            }}
          >
            Create a new ride
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};
