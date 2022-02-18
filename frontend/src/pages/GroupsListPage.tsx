import * as React from "react";
import { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { ref } from "firebase/database";
import { useListVals } from "react-firebase-hooks/database";
import { Group } from "./CreateGroup";
import Header from "../components/Header";
import { groupLogos } from "../theme/colours";
import { GiMagnifyingGlass } from "react-icons/all";

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
      <Center>
        <Box textAlign={"center"}>
          <Heading>My Groups</Heading>
          <InputGroup mt={4}>
            <Input placeholder="Search Groups" />
            <InputLeftElement>
              <GiMagnifyingGlass />
            </InputLeftElement>
          </InputGroup>
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
              ?.map((groups, i) => (
                <HStack key={i}>
                  <Avatar
                    bg={groupLogos[i % groupLogos.length]}
                    size="xs"
                    textAlign="center"
                    name={groups.name}
                  />
                  <Link href={`group/${groups.id}`} margin={"2rem"}>
                    {groups.name}
                  </Link>
                </HStack>
              ))}
          </VStack>
          {loadingGroups ? <Spinner /> : null}
          {error ? <Text>{JSON.stringify(error)}</Text> : null}
          <Button onClick={() => navigate("group/new")}>Create a Group</Button>
        </Box>
      </Center>
    </>
  );
}
