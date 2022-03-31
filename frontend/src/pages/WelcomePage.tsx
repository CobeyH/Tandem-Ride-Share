import * as React from "react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import Header from "../components/Header";
import GroupList from "../components/Groups/GroupSelector";
import { Group } from "../firebase/database";
import { Box, Center, Heading, HStack, VStack, Text } from "@chakra-ui/react";
import Tutorial from "../components/Tutorial";
import { FaQuestionCircle } from "react-icons/fa";

const tutorialSteps = [
  {
    target: "#get-started",
    content:
      "Welcome to Tandem! An app designed to foster community by bringing people together.",
    disableBeacon: true,
  },
  {
    target: "#tutorial",
    content: (
      <>
        <Text mb={3}>
          If you ever need help, click on the question mark icon.
        </Text>
        <Center>
          <FaQuestionCircle />
        </Center>
      </>
    ),
  },
  {
    target: "#new-group",
    content: "You can get started by creating a group of your own.",
  },
  {
    target: "#search-group",
    content: "Or you can search for an established group.",
  },
  {
    target: "#home",
    content:
      "If you every get stuck, click the Tandem logo to return to your group pages.",
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
      <Header tutorialSteps={tutorialSteps} />
      <HStack alignItems="flex-start">
        <GroupList updateGroups={setGroups} />
        <Box flexGrow={1}>
          <Center>
            <VStack spacing={"5%"}>
              <Heading
                mt={{ base: "40%", md: "30%" }}
                id="get-started"
                fontSize={{ base: "2xl", md: "4xl" }}
              >
                Welcome to Tandem!
              </Heading>
              <Box textAlign={"center"}>
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight={"medium"}
                  textColor={"gray.500"}
                >
                  Excuse the occasional flat tire!
                </Text>
                <Text>
                  Our app is still in beta. We are working to patch things up.
                  Let us know how we can make your experience better.
                </Text>
              </Box>
              <Tutorial steps={tutorialSteps} buttonText="Get Started" />
            </VStack>
          </Center>
        </Box>
      </HStack>
    </>
  );
}
