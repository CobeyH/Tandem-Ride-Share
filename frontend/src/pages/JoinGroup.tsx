import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { auth } from "../firebase/firebase";
import { Group, useGroup } from "../firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../components/Header";
import { NavConstants } from "../NavigationConstants";
import SignInRegisterButton from "../components/SignInRegister";
import GroupJoinButton from "../components/Groups/GroupJoinButton";
import GroupAvatar from "../components/Groups/GroupAvatar";
import { styleColors } from "../theme/colours";

export type LocationGotoState = { goto?: string };
type GroupUserProps = { group: Group; userId: string | undefined };

const JoinGroup = () => {
  const navigate = useNavigate();
  const groupId = useParams()["groupId"];
  if (!groupId) {
    console.log("Figure something better to do here.");
    navigate("/");
    return <></>;
  }
  const [user, loadingUser] = useAuthState(auth);
  const [group, loadingGroup, groupError] = useGroup(groupId);

  if (user && group?.members[user.uid]) {
    navigate(NavConstants.groupWithId(groupId));
  }

  return groupError ? (
    <Text> Error: {groupError}</Text>
  ) : loadingUser || loadingGroup ? (
    <Spinner />
  ) : group ? (
    <FoundGroup group={group} userId={user ? user.uid : undefined} />
  ) : (
    <GroupNotFound />
  );
};

const FoundGroup = (props: GroupUserProps) => {
  const statsBackgroundColor = useColorModeValue(
    styleColors.paleBlueAlpha700,
    "whiteAlpha.300"
  );

  return (
    <>
      <Header />
      <Container>
        <VStack mb={4} mt={8} spacing={4}>
          <GroupAvatar group={props.group} index={0} size={"xl"} />
          <VStack spacing={{ base: 4, md: 6 }} mt={{ base: 2, md: 4 }}>
            <VStack alignItems={"center"}>
              <Heading mb={4} size={"xl"}>
                {props.group.name}
              </Heading>
              <HStack>
                <Text
                  fontSize={"lg"}
                  bg={statsBackgroundColor}
                  borderRadius={100}
                  p={4}
                  px={6}
                >
                  Members: {Object.keys(props.group?.members ?? {}).length}
                </Text>
                <Text
                  fontSize={"lg"}
                  bg={statsBackgroundColor}
                  borderRadius={100}
                  p={4}
                  px={6}
                >
                  Rides Taken: {props.group.rides?.length ?? 0}
                </Text>
              </HStack>
            </VStack>
            <Text px={{ base: 5, sm: 7, md: 10 }} py={4} fontWeight={"medium"}>
              {props.group.description}
            </Text>
          </VStack>
          <JoinGroupOpts {...props} />
        </VStack>
      </Container>
    </>
  );
};

const GroupNotFound = () => {
  const navigate = useNavigate();

  return (
    <Center>
      <Box>
        <Heading>Group not found</Heading>
        <Button onClick={() => navigate("/group")}>Groups</Button>
      </Box>
    </Center>
  );
};

const JoinGroupOpts = ({ group, userId }: GroupUserProps) => {
  const state: LocationGotoState = {
    goto: NavConstants.groupWithIdJoin(group.id),
  };

  return (
    <>
      {userId === undefined ? (
        <Box p={2}>
          <Text mb={4}>Please sign in to join this group:</Text>
          <SignInRegisterButton state={state} />
        </Box>
      ) : (
        <Box p={2}>
          <GroupJoinButton group={group} userId={userId} />
        </Box>
      )}
    </>
  );
};

export default JoinGroup;
