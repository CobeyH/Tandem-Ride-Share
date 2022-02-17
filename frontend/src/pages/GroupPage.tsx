import * as React from "react";
import {
  Button,
  Center,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
  Image,
  Box,
  Container,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { db, DB_RIDE_COLLECT } from "../firebase";
import { ref } from "firebase/database";
import { Group } from "./CreateGroup";
import { Val } from "react-firebase-hooks/database/dist/database/types";
import { useList, useObjectVal } from "react-firebase-hooks/database";
import RideCard from "../components/RideCard";
import Header from "../components/Header";
import { storage } from "../storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { ref as storageRef } from "firebase/storage";
import ShareLink from "../components/ShareLink";

export default function GroupPage() {
  const navigate = useNavigate();
  const groupId = useParams()["groupId"];
  if (groupId === undefined) {
    console.log("figure something better to do here");
    navigate("/");
  }
  const [group, loading, error] = useObjectVal<Group>(
    ref(db, `groups/${groupId}`)
  );

  return (
    <>
      {loading ? (
        <Spinner />
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
          width="95%"
          maxHeight="200px"
          objectFit="cover"
          pb={5}
        />
      )}
      <Container>
        <VStack spacing="24px" align="c">
          <Heading>{group.name}</Heading>
          <Text>{group.description}</Text>
          {group.rides
            ? Object.keys(group.rides).map((key) => (
                <RideCard key={key} rideId={key} />
              ))
            : null}
          <Button
            onClick={() => {
              navigate(`/group/${group.id}/ride/new`);
            }}
          >
            New Ride
          </Button>
          <ShareLink />
        </VStack>
      </Container>
    </>
  );
};
