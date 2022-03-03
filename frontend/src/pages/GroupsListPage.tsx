import * as React from "react";
import { useEffect } from "react";
import {
  Avatar,
  Button,
  Center,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { ref } from "firebase/database";
import { useListVals } from "react-firebase-hooks/database";
import { Group } from "./CreateGroup";
import Header from "../components/Header";
import { groupLogos } from "../theme/colours";
import { NavConstants } from "../NavigationConstants";
import GroupSearch from "../components/GroupSearch";

export default function GroupsListPage() {
  const [user, loading] = useAuthState(auth);
  const [groups, loadingGroups, error] = useListVals<Group>(ref(db, "groups"));

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
        <VStack>
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
              <Button
                mt={4}
                key={i}
                onClick={() => navigate(NavConstants.groupWithIdJoin(group.id))}
              >
                <Avatar
                  bg={groupLogos[i % groupLogos.length]}
                  size="xs"
                  textAlign="center"
                  name={group.name}
                  mr={4}
                />{" "}
                {group.name}
              </Button>
            ))}
        </VStack>
        {loadingGroups ? <Spinner /> : null}
        {error ? <Text>{JSON.stringify(error)}</Text> : null}
        <Center pt={4}>
          <Button onClick={() => navigate("group/new")}>Create a Group</Button>
        </Center>
      </Container>
    </>
  );
}
