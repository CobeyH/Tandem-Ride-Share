import {
  Avatar,
  Box,
  Button,
  IconButton,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { ref } from "@firebase/storage";
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { IconType } from "react-icons";
import { useNavigate } from "react-router";
import { Group, useGroups } from "../../firebase/database";
import { auth } from "../../firebase/firebase";
import { storage } from "../../firebase/storage";
import { NavConstants } from "../../NavigationConstants";
import { groupLogos, styleColors } from "../../theme/colours";
import * as icons from "react-icons/gi";
import { FaPlus } from "react-icons/fa";
import GroupSearch from "./GroupSearch";

const GroupList = (props: { updateGroups?: (groups: Group[]) => void }) => {
  const [user, loading] = useAuthState(auth);
  const [groups] = useGroups();
  const [userGroups, setUserGroups] = useState<Group[]>();

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);

  useEffect(() => {
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
    );
    if (props.updateGroups) {
      props.updateGroups(userGroups ?? []);
    }
  }, [groups]);

  return (
    <Box h="100vh" bg={styleColors.lightPeri}>
      <VStack>
        {userGroups?.map((group, i) => (
          <GroupListElement key={i} group={group} index={i} />
        ))}
        <NewGroupButton />
        <GroupSearch groups={groups ?? []} />
      </VStack>
    </Box>
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
        aria-label="New-Group"
        onClick={() => navigate("/group/new")}
        icon={<FaPlus />}
        isRound
      />
    </Tooltip>
  );
};

const GroupListElement = (props: { group: Group; index: number }) => {
  const navigate = useNavigate();
  const photoName = props.group.profilePic;
  const profileRef =
    photoName && photoName.startsWith("profilePics/")
      ? ref(storage, `${photoName}`)
      : undefined;
  const [profilePic, profilePicLoading] = useDownloadURL(profileRef);

  return (
    <>
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
          {profilePicLoading ? null : profilePic ? (
            <Avatar
              bg={groupLogos[props.index % groupLogos.length]}
              src={profilePic}
              size="sm"
            />
          ) : photoName ? (
            <Avatar
              bg={groupLogos[props.index % groupLogos.length]}
              as={(icons as { [k: string]: IconType })[photoName]}
              size="sm"
            />
          ) : (
            <Avatar
              bg={groupLogos[props.index % groupLogos.length]}
              name={photoName ? undefined : props.group.name}
              size="sm"
            />
          )}
        </Button>
      </Tooltip>
    </>
  );
};

export default GroupList;
