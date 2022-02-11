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
          ?.filter(({ members }) =>
            (members ?? []).includes(user?.uid ?? "INVALID")
          )
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
