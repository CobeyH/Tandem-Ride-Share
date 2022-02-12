import * as React from "react";
import { useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { ref } from "firebase/database";
import { useListVals } from "react-firebase-hooks/database";
import { Group } from "./CreateGroup";

export default function GroupsListPage() {
  const [user, loading] = useAuthState(auth);
  const [groups, loadingGroups, error] = useListVals<Group>(ref(db, "groups"));

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);

  return (
    <Center>
      <Box textAlign={"center"}>
        <Heading>Groups Page</Heading>
        <Button onClick={logout}>Logout</Button>
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
              <Link key={i} href={`group/${groups.id}`} margin={"2rem"}>
                {groups.name}
              </Link>
            ))}
        </VStack>
        {loadingGroups ? <Spinner /> : null}
        {error ? <Text>{JSON.stringify(error)}</Text> : null}
        <Button onClick={() => navigate("group/new")}>Create a Group</Button>
      </Box>
    </Center>
  );
}
