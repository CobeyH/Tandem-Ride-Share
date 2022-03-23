import * as React from "react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import Header from "../components/Header";
import GroupList from "../components/Groups/GroupSelector";
import { Group } from "../firebase/database";
import { Box, Button, Center, Heading, HStack, VStack } from "@chakra-ui/react";

export default function WelcomePage() {
  const [user, loading] = useAuthState(auth);
  const [groups, setGroups] = useState<Group[]>();

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    if (groups && groups.length > 0) {
      navigate(`/group/${groups[0].id}`);
    }
  }, [groups]);

  return (
    <>
      <Header />
      <HStack alignItems="flex-start">
        <GroupList updateGroups={setGroups} />
        <Box flexGrow={1}>
          <Center>
            <VStack spacing="5%">
              <Heading mt={"50%"} fontSize={{ base: "2xl", md: "4xl" }}>
                Welcome to Tandem!
              </Heading>
              <Button>Get Started</Button>
            </VStack>
          </Center>
        </Box>
      </HStack>
    </>
  );
}
