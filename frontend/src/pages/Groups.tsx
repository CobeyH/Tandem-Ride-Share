import * as React from "react";
import { Button, Flex, Box, Heading, Link, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase";
import { useEffect } from "react";

type group = { name: string; number_members: number };

export default function Groups(props: { groups: group[] }) {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);

  return (
    <Flex width="full" align="start" justifyContent="center">
      <Box textAlign="center">
        <Heading>Groups Page</Heading>
        <Button onClick={logout}>Logout</Button>
        {props.groups.map((group, i) => (
          <div key={i}>
            <Link href={"/rides"}>{group.name}</Link>
            <Text> {group.number_members} </Text>
          </div>
        ))}
      </Box>
    </Flex>
  );
}
