import * as React from "react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import Header from "../components/Header";
import GroupList from "../components/Groups/GroupSelector";
import { Group } from "../firebase/database";
import Joyride from "react-joyride";
import { Box, Button, Center, Heading, HStack, VStack } from "@chakra-ui/react";

const steps = [
  {
    target: "#target1",
    content:
      "Welcome to Tandem! An app designed to foster community by bringing people together.",
  },
  {
    target: "#new-group",
    content: "You can get started by creating a group of your own.",
  },
  {
    target: "#search-group",
    content: "Or you can search for an established group.",
  },
];

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
      <Joyride steps={steps} showProgress showSkipButton continuous />
      <HStack alignItems="flex-start">
        <GroupList updateGroups={setGroups} />
        <Box flexGrow={1}>
          <Center>
            <VStack spacing="5%">
              <Heading mt={"50%"} fontSize={{ base: "2xl", md: "4xl" }}>
                Welcome to Tandem!
              </Heading>
              <Button id="target1">Get Started</Button>
            </VStack>
          </Center>
        </Box>
      </HStack>
    </>
  );
}
