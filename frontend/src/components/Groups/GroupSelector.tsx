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
          position="fixed"
          aria-label="toggle-group-list"
          ml={-2}
          mt={"50vh"}
          icon={<FaChevronRight />}
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
            groups={groups ?? []}
          />
          <Spacer />
          {isOpen ? (
            <IconButton
              aria-label="toggle-group-list"
              icon={<FaChevronLeft />}
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
        groups={groups ?? []}
      />
    </Box>
  );
};

const ListContents = ({
  userGroups,
  isMobile,
  groups,
}: {
  userGroups: Group[];
  groups: Group[];
  isMobile: boolean | undefined;
}) => {
  return (
    <VStack mt={5} mx={2} spacing={3}>
      {userGroups?.map((group, i) => (
        <GroupListElement
          key={group.id}
          group={group}
          index={i}
          isMobile={isMobile}
        />
      ))}
      <NewGroupButton />
      <GroupSearch groups={groups} />
    </VStack>
  );
};

const NewGroupButton = () => {
  const navigate = useNavigate();
  return (
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
        size="md"
        mx={5}
      />
    </Tooltip>
  );
};

const GroupListElement = (props: {
  group: Group;
  index: number;
  isMobile: boolean | undefined;
}) => {
  const navigate = useNavigate();
  return props.isMobile ? (
    <>
      <Button
        onClick={() => navigate(NavConstants.groupWithId(props.group.id))}
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
        variant="ghost"
      >
        <GroupAvatar group={props.group} index={props.index} />
      </Button>
    </Tooltip>
  );
};

export default GroupList;