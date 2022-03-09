import * as React from "react";
import { useEffect } from "react";
import {
  Avatar,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import Header from "../components/Header";
import { groupLogos } from "../theme/colours";
import { NavConstants } from "../NavigationConstants";
import GroupSearch from "../components/GroupSearch";
import { Group, useGroups } from "../firebase/database";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { ref } from "firebase/storage";
import { storage } from "../firebase/storage";

export default function GroupsListPage() {
  const [user, loading] = useAuthState(auth);
  const [groups, loadingGroups, error] = useGroups();

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);

  return (
    <>
      <Header />
      <Container>
        <Center>
          <Heading size={"md"}>My Groups</Heading>
        </Center>
        <GroupSearch groups={groups ?? []} />
        <Center>
          <Flex direction="column">
            <VStack align="stretch">
              {groups
                ?.filter(({ members }) => {
                  if (
                    user !== null &&
                    user !== undefined &&
                    typeof (user ?? null) === "object" // we love javascript.
                  ) {
                    return members[user.uid] ?? false;
                  } else {
                    console.log("null users should be kicked back to login.");
                    return false;
                  }
                })
                ?.map((group, i) => (
                  <GroupListElement key={i} group={group} index={i} />
                ))}
            </VStack>
          </Flex>
        </Center>
        {loadingGroups ? <Spinner /> : null}
        {error ? <Text>{JSON.stringify(error)}</Text> : null}
        <Center pt={4}>
          <Button onClick={() => navigate("group/new")}>Create a Group</Button>
        </Center>
      </Container>
    </>
  );
}

const GroupListElement = (props: { group: Group; index: number }) => {
  const navigate = useNavigate();
  const profileRef = ref(storage, `${props.group.profilePic}`);
  const [profilePic, profilePicLoading] = props.group.profilePic
    ? useDownloadURL(profileRef)
    : [undefined, false];
  return (
    <>
      <Button
        mt={4}
        textAlign="left"
        onClick={() => navigate(NavConstants.groupWithIdJoin(props.group.id))}
      >
        {profilePicLoading ? null : (
          <Avatar
            bg={groupLogos[props.index % groupLogos.length]}
            src={profilePic}
            size="xs"
            name={props.group.name}
            mr={4}
          />
        )}
        {props.group.name}
      </Button>
    </>
  );
};
