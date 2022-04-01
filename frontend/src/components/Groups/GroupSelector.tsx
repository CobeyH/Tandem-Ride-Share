import {
  Box,
  Button,
  IconButton,
  Tooltip,
  useBreakpointValue,
  VStack,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { Group, useGroups } from "../../firebase/database";
import { auth } from "../../firebase/firebase";
import { NavConstants } from "../../NavigationConstants";
import { styleColors } from "../../theme/colours";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import GroupSearch from "./GroupSearch";
import GroupAvatar from "./GroupAvatar";
import { useParams } from "react-router-dom";

const GroupList = (props: { updateGroups?: (groups: Group[]) => void }) => {
  const [user] = useAuthState(auth);
  const [groups] = useGroups();
  const [userGroups, setUserGroups] = useState<Group[]>();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(
    () =>
      setUserGroups(
        groups?.filter(({ members }) => {
          if (
            user !== null &&
            user !== undefined &&
            typeof (user ?? null) === "object" // we love Typescript.
          ) {
            return members[user.uid] ?? false;
          } else {
            console.log("null users should be kicked back to login.");
            return false;
          }
        })
      ),
    [groups]
  );

  useEffect(() => {
    if (props.updateGroups) {
      props.updateGroups(userGroups ?? []);
    }
  }, [userGroups, props.updateGroups]);

  return isMobile ? (
    <>
      {!isOpen ? (
        <IconButton
          id="selector-open"
          position="fixed"
          aria-label="toggle-group-list"
          ml={-2}
          mt={"50vh"}
          icon={<FaChevronRight />}
          bg={useColorModeValue("rgba(0,0,0, 0.1)", "rgba(255,255,255, 0.1)")}
          onClick={() => (isOpen ? onClose() : onOpen())}
          variant="ghost"
        />
      ) : null}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xs"
      >
        <DrawerContent bg={styleColors.mainBlue}>
          <ListContents
            userGroups={userGroups ?? []}
            isMobile={isMobile}
            fullSizeButtons={isOpen}
            groups={groups ?? []}
          />
          <Spacer />
          {isOpen ? (
            <IconButton
              aria-label="toggle-group-list"
              icon={<FaChevronLeft />}
              borderRadius={0}
              bgGradient={"linear(to-r, styleColors.mainBlue, white)"}
              onClick={() => (isOpen ? onClose() : onOpen())}
            />
          ) : null}
        </DrawerContent>
      </Drawer>
    </>
  ) : (
    <Box h="100vh" bg={styleColors.mainBlue} position="sticky" top={0}>
      <ListContents
        userGroups={userGroups ?? []}
        isMobile={isMobile}
        fullSizeButtons={false}
        groups={groups ?? []}
      />
    </Box>
  );
};

const ListContents = ({
  userGroups,
  isMobile,
  groups,
  fullSizeButtons,
}: {
  userGroups: Group[];
  groups: Group[];
  isMobile: boolean | undefined;
  fullSizeButtons: boolean;
}) => {
  return (
    <VStack
      mt={5}
      mx={4}
      h={isMobile ? "90%" : ""}
      spacing={2}
      alignItems={isMobile ? "stretch" : "center"}
    >
      {userGroups?.map((group, i) => (
        <GroupListElement
          key={group.id}
          group={group}
          index={i}
          isMobile={isMobile}
        />
      ))}
      {userGroups.length > 0 ? <Spacer /> : null}
      <NewGroupButton fullSizeButtons={fullSizeButtons} />
      <GroupSearch groups={groups} fullSizeButtons={fullSizeButtons} />
    </VStack>
  );
};

const NewGroupButton = ({ fullSizeButtons }: { fullSizeButtons: boolean }) => {
  const navigate = useNavigate();
  return fullSizeButtons ? (
    <Button
      leftIcon={<FaPlus />}
      onClick={() => navigate("/group/new")}
      w="80%"
      borderRadius={100}
      alignSelf={"center"}
    >
      New Group
    </Button>
  ) : (
    <Tooltip
      label="Create a New Group"
      aria-label="create a new group"
      hasArrow
      placement="right"
    >
      <IconButton
        id="new-group"
        aria-label="New-Group"
        onClick={() => navigate("/group/new")}
        icon={<FaPlus />}
        isRound
        size="lg"
      />
    </Tooltip>
  );
};

const GroupListElement = (props: {
  group: Group;
  index: number;
  isMobile: boolean | undefined;
}) => {
  const groupId = useParams()["groupId"];
  const isCurrentGroup = () => {
    return groupId === props.group.id;
  };
  const navigate = useNavigate();
  return props.isMobile ? (
    <>
      <Button
        py={6}
        onClick={() => navigate(NavConstants.groupWithId(props.group.id))}
        justifyContent={"flex-start"}
      >
        <GroupAvatar group={props.group} index={props.index} size="xs" />
        <Text ml={3}>{props.group.name}</Text>
      </Button>
    </>
  ) : (
    <Tooltip
      label={props.group.name}
      aria-label={props.group.name}
      hasArrow
      placement="right"
    >
      <Button
        mt={4}
        onClick={() => navigate(NavConstants.groupWithId(props.group.id))}
        borderRadius={100}
        variant={isCurrentGroup() ? "tandem-group-current" : "tandem-group"}
      >
        <GroupAvatar group={props.group} index={props.index} />
      </Button>
    </Tooltip>
  );
};

export default GroupList;
