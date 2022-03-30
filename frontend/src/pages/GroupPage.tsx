import * as React from "react";
import {
  Button,
  Heading,
  Text,
  VStack,
  Image,
  Box,
  Container,
  HStack,
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
import { groupMaxSize } from "../components/Promotional/PriceSelector";
import GroupSettings from "../components/Groups/GroupSettings";
import GroupDrawer from "../components/Groups/GroupDrawer";
import GroupSelector from "../components/Groups/GroupSelector";
import { LoadingPage } from "../App";
import GroupAvatar from "../components/Groups/GroupAvatar";

const tutorialSteps = [
  {
    target: "#share-link",
    content:
      "The share link button can be used to invite other people to your group.",
    disableBeacon: true,
  },
  {
    target: "#chat",
    content:
      "You can chat with other group members or see who is in your group.",
  },
  {
    target: "#active-rides",
    content: "You can also view the rides that are taking place in the future.",
  },
  {
    target: "#prev-rides",
    content:
      "The previous rides section is an archive of the rides that have already occured.",
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

  return (
    <Box flexGrow={1}>
      {bannerLoading || error ? (
        <Box h="10%" w="100%" maxHeight="150" minHeight="100" />
      ) : (
        <Image
          src={banner}
          h="10%"
          w="100%"
          maxHeight="150"
          objectFit="cover"
        />
      )}

      <Container>
        <VStack spacing="24px" justifyContent={"center"}>
          <GroupAvatar group={group} index={0} mt={10} size="xl" />
          <Heading textAlign={"center"} mt={5}>
            {group.name}
          </Heading>
          <HStack mt={5} align="center" spacing={5}>
            <ShareLink user={user} />
            <GroupDrawer
              members={group.members}
              ownerId={group.owner}
              maxSize={groupMaxSize(group.plan)}
              groupId={group.id}
            />
            {group.owner === user?.uid ? <GroupSettings group={group} /> : null}
          </HStack>
          {group.description && group.description.length > 0 ? (
            <Box px={5} py={5} textAlign="left" w="100%">
              {group.description}
            </Box>
          ) : null}
          <Box
            textAlign="left"
            fontWeight="bold"
            fontSize="22"
            w="100%"
            px={5}
            pt={5}
            pb={2}
            id="active-rides"
          >
            Active Rides
          </Box>
          {group.rides ? (
            Object.keys(group.rides).map((key) => (
              <RideCard key={key} rideId={key} isActive={true} />
            ))
          ) : (
            <Text>There are no currently active rides...</Text>
          )}
          <Button
            fontWeight="normal"
            id="new-ride"
            onClick={() => {
              navigate(`/group/${group.id}/ride/new`);
            }}
          >
            Create a new ride
          </Button>
          <Box
            textAlign="left"
            fontWeight="bold"
            fontSize="22"
            w="100%"
            px={5}
            pt={5}
            pb={2}
            id="prev-rides"
          >
            Previous Rides
          </Box>
          {group.rides
            ? Object.keys(group.rides).map((key) => (
                <RideCard key={key} rideId={key} isActive={false} />
              ))
            : null}
        </VStack>
      </Container>
    </Box>
  );
};
