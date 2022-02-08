import * as React from "react";
import { Button, Flex, Box, Heading } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase";
import { useEffect } from "react";

export default function Groups() {
  const [user, loading, error] = useAuthState(auth);
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
      </Box>
    </Flex>
  );
}
