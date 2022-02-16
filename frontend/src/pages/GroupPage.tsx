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
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { db, DB_RIDE_COLLECT } from "../firebase";
import { ref } from "firebase/database";
import { Group } from "./CreateGroup";
import { Val } from "react-firebase-hooks/database/dist/database/types";
import { useList, useObjectVal } from "react-firebase-hooks/database";
import Header from "./Header";
import { storage } from "../storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { ref as storageRef } from "firebase/storage";

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
    <Flex width="full" align="start" justifyContent="center">
      {loading ? (
        <Spinner />
      ) : error ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : group ? (
        <SingleGroup group={group} />
      ) : (
        <Text>No such group exists</Text>
      )}
    </Flex>
  );
}

const SingleGroup = ({ group }: { group: Val<Group> }) => {
  const navigate = useNavigate();
  const [snapshots, loading, error] = useList(
    ref(db, `${DB_RIDE_COLLECT}/${group.id}`)
  );
  const [banner] = useDownloadURL(storageRef(storage, `${group.banner}`));

  return (
    <Flex flexDirection="column" width="100%" align="center">
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

      <VStack spacing="24px" align="c" width="20%">
        <Heading>{group.name}</Heading>
        <Text>{group.description}</Text>
        {error && <strong>Error: {error}</strong>}
        {loading && <Center>Loading...</Center>}
        {!loading &&
          snapshots &&
          snapshots.map((v) => (
            <Button
              key={v.key}
              onClick={() => {
                navigate(`/ride/${v.key}`);
              }}
            >
              {v.val().name}
            </Button>
          ))}
        <Button
          onClick={() => {
            navigate(`/group/${group.id}/ride/new`);
          }}
        >
          New Ride
        </Button>
      </VStack>
    </Flex>
  );
};
