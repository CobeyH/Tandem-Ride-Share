import * as React from "react";
import {
  Button,
  Heading,
  Spinner,
  Text,
  VStack,
  Image,
  Box,
  Container,
  Center,
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
      {loading ? (
        <Center p={"35%"}>
          <Spinner speed={"1.0s"} p={"10%"} />
        </Center>
      ) : error ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : group ? (
        <SingleGroup group={group} />
      ) : (
        <Text>No such group exists</Text>
      )}
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
    <>
      <Header pages={[{ label: "My Groups", url: "/" }]} />
      {bannerLoading || error ? (
        <Box bg="blue" h="10%" w="100%" maxHeight="200px" minHeight="100" />
      ) : (
        <Image src={banner} width="100%" maxHeight="200px" objectFit="cover" />
      )}
      <Container>
        <VStack spacing="24px" align="c">
          <HStack pt={5}>
            <ShareLink user={user} />
            <GroupDrawer
              members={group.members}
              ownerId={group.owner}
              maxSize={groupMaxSize(group.plan)}
              groupId={group.id}
            />
            {group.owner === user?.uid ? <GroupSettings group={group} /> : null}
          </HStack>

          <Heading textAlign={"center"}>{group.name}</Heading>
          <Box bg="white" px={5} py={5} borderRadius={"4px"}>
            <Text> Description: </Text>
            <Text> {group.description}</Text>
          </Box>
          <Text>Active Rides</Text>
          {group.rides
            ? Object.keys(group.rides).map((key) => (
                <RideCard key={key} rideId={key} isActive={true} />
              ))
            : null}
          <Text>Previous Rides</Text>
          {group.rides
            ? Object.keys(group.rides).map((key) => (
                <RideCard key={key} rideId={key} isActive={false} />
              ))
            : null}
          <Button
            onClick={() => {
              navigate(`/group/${group.id}/ride/new`);
            }}
          >
            New Ride
          </Button>
        </VStack>
      </Container>
    </>
  );
};
