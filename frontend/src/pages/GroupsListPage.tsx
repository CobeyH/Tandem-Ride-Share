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
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { ref } from "firebase/database";
import { useListVals } from "react-firebase-hooks/database";

export type Group = {
  id: string;
  name: string;
  rides: string[];
  members: string[];
};

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
        {groups
          ?.filter(({ members }) => {
            if (
              user !== null &&
              user !== undefined &&
              typeof (user ?? null) === "object" // we love javascript.
            ) {
              return (members ?? []).includes(user.uid); // this is slow when we get a lot of groups but should be fine for now.
            } else {
              console.log("null users should be kicked back to login.");
              return false;
            }
          })
          ?.map((groups, i) => (
            <Link key={i} href={`group/${groups.id}`}>
              {groups.name}
            </Link>
          ))}
        {loadingGroups ? <Spinner /> : null}
        {error ? <Text>{JSON.stringify(error)}</Text> : null}
        <Link href={"group/new"}>Create a Group</Link>
      </Box>
    </Center>
  );
}
