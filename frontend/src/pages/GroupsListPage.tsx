import * as React from "react";
import { useEffect } from "react";
import {
  Avatar,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import Header from "../components/Header";
import { groupLogos } from "../theme/colours";
import { NavConstants } from "../NavigationConstants";
import GroupSearch from "../components/Groups/GroupSearch";
import {
  finishTutorial,
  Group,
  useGroups,
  useUser,
} from "../firebase/database";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { ref } from "firebase/storage";
import { storage } from "../firebase/storage";
import * as icons from "react-icons/gi";
import { IconType } from "react-icons";
import Joyride, { CallBackProps, STATUS } from "react-joyride";

export default function GroupsListPage() {
  const [user, loading] = useAuthState(auth);
  const [groups, loadingGroups, error] = useGroups();
  const [userData] = useUser(user?.uid);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);

  const steps = [
    {
      target: "#target1",
      content:
        "Welcome to Tandem! An app designed to foster community by bringing people together.",
    },
    {
      target: "#target2",
      content: "You can search for an existing group to get started.",
    },
    {
      target: "#target3",
      content: "Or you can create a group for your own needs.",
    },
  ];

  const handleTutorialFinished = (data: CallBackProps) => {
    const { status } = data;
    if (!user) return;
    if (status == STATUS.FINISHED || status == STATUS.SKIPPED) {
      finishTutorial(user.uid, "groups");
    }
  };

  return (
    <>
      <Header />
      {!userData?.tutorials?.groups ? (
        <Joyride
          steps={steps}
          callback={handleTutorialFinished}
          showProgress
          showSkipButton
          continuous
        />
      ) : null}
      <Container>
        <Center>
          <Heading size={"md"} mt={5}>
            My Groups
          </Heading>
        </Center>
        <GroupSearch id="target2" groups={groups ?? []} />
        <Center id="target1">
          <Flex direction="column">
            <VStack align="stretch">
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
                ?.map((group, i) => (
                  <GroupListElement key={i} group={group} index={i} />
                ))}
            </VStack>
          </Flex>
        </Center>
        {loadingGroups ? <Spinner /> : null}
        {error ? <Text>{JSON.stringify(error)}</Text> : null}
        <Center pt={4}>
          <Button id="target3" onClick={() => navigate("group/new")}>
            Create a Group
          </Button>
        </Center>
      </Container>
    </>
  );
}

const GroupListElement = (props: { group: Group; index: number }) => {
  const navigate = useNavigate();
  const photoName = props.group.profilePic;
  const profileRef = ref(storage, `${photoName}`);
  const [profilePic, profilePicLoading] = useDownloadURL(profileRef);

  return (
    <>
      <Button
        mt={4}
        textAlign="left"
        onClick={() => navigate(NavConstants.groupWithIdJoin(props.group.id))}
      >
        {profilePicLoading ? null : profilePic ? (
          <Avatar
            bg={groupLogos[props.index % groupLogos.length]}
            src={profilePic}
            size="xs"
            name={photoName ? undefined : props.group.name}
            mr={4}
          />
        ) : photoName ? (
          <Avatar
            bg={groupLogos[props.index % groupLogos.length]}
            as={(icons as { [k: string]: IconType })[photoName]}
            size="xs"
            mr={4}
          />
        ) : null}
        {props.group.name}
      </Button>
    </>
  );
};
