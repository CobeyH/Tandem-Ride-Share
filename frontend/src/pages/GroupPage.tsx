import * as React from "react";
import { Center, Flex, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { equalTo, orderByChild, query, ref } from "firebase/database";
import { Group } from "./GroupsListPage";
import { Val } from "react-firebase-hooks/database/dist/database/types";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import { Ride } from "./RidePage";

export default function GroupPage() {
  const navigate = useNavigate();
  const groupId = useParams()["groupId"];
  console.log(useParams());
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
  const [snapshots, loading, error] = useListVals<Ride>(
    query(ref(db, "rides"), orderByChild("groupId"), equalTo(group.id))
  );

  return (
    <VStack spacing="24px" align="stretch">
      <Heading>{group.name}</Heading>
      {error && <strong>Error: {error}</strong>}
      {loading && <Center>Loading...</Center>}
      {!loading &&
        snapshots &&
        snapshots.map((v) => <Center key={v.title}>{v.title}</Center>)}
    </VStack>
  );
};
