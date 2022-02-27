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
import { db, DB_GROUP_COLLECT } from "../firebase";
import { ref } from "firebase/database";
import { Group } from "./CreateGroup";
import { Val } from "react-firebase-hooks/database/dist/database/types";
import { useObjectVal } from "react-firebase-hooks/database";
import RideCard from "../components/RideCard";
import Header from "../components/Header";
import { storage } from "../storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { ref as storageRef } from "firebase/storage";
import ShareLink from "../components/ShareLink";
import PreviousRides from "../components/PreviousRides";

export default function GroupPage() {
  const navigate = useNavigate();
  const groupId = useParams()["groupId"];
  if (groupId === undefined) {
    console.log("figure something better to do here");
    navigate("/");
  }
  const [group, loading, error] = useObjectVal<Group>(
    ref(db, `${DB_GROUP_COLLECT}/${groupId}`)
  );

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
  const [banner] = useDownloadURL(storageRef(storage, `${group.banner}`));

  return (
    <>
      <Header pages={[{ label: "Group List", url: "/" }]} />
      {banner === "loading" ? (
        <Box />
      ) : (
        <Image
          src={banner}
          width="100%"
          maxHeight="200px"
          objectFit="cover"
          pb={5}
        />
      )}
      <Container>
        <VStack spacing="24px" align="c">
          <HStack>
            <Heading textAlign={"center"}>{group.name}</Heading>
            <ShareLink />
          </HStack>
          <Box bg="white" px={5} py={5} borderRadius={"4px"}>
            <Text> Description: </Text>
            <Text> {group.description}</Text>
          </Box>
          <Text>Active Rides</Text>
          {group.rides
            ? Object.keys(group.rides).map((key) => (
                <RideCard key={key} rideId={key} />
              ))
            : null}
          <Text>Previous Rides</Text>
          {group.rides
            ? Object.keys(group.rides).map((key) => (
                <PreviousRides key={key} rideId={key} />
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
