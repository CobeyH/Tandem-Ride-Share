import React, { useState } from "react";
import {
  Button,
  Heading,
  Input,
  InputGroup,
  Text,
  Stack,
  HStack,
  Textarea,
  Checkbox,
  Tooltip,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import {
  DBConstants,
  getGroup,
  Group,
  setGroup,
  setGroupBanner,
  setGroupProfilePic,
} from "../firebase/database";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import Header from "../components/Header";
import { PhotoType, uploadPhoto } from "../firebase/storage";
import FileDropzone from "../components/FileDropzone";
import GroupSizeSlider from "../components/Groups/GroupSizeSlider";

type ValidatableFiled<T> = {
  field: T;
  invalid: boolean;
};

const createGroup = async (groupData: Omit<Group, "id">, userId: string) => {
  const group = {
    ...groupData,
    id: slugify(groupData.name, DBConstants.KEY_SLUG_OPTS),
  };
  await getGroup(group.id)
    .then(() => {
      /* TODO: increment id */
      throw new Error("Group ID already exists");
    })
    .catch((err) => {
      if (err === undefined) {
        group.members[userId] = true;
        setGroup(group);
      }
    });
  return group;
};

const CreateGroup = () => {
  // TODO: Fix type
  const [banner, setBanner] = useState<Blob | MediaSource>();
  const [profilePic, setProfilePic] = useState<Blob | MediaSource>();

  const handleCallback = (childBanner: Blob | MediaSource) => {
    setBanner(childBanner);
  };

  const handleProfilePicSubmit = (childPic: Blob | MediaSource) => {
    setProfilePic(childPic);
  };

  const [user] = useAuthState(auth);
  const [{ field: name, invalid: invalidName }, setName] = useState<
    ValidatableFiled<string>
  >({
    field: user?.displayName ? user.displayName + "'s Group" : "",
    invalid: false,
  });
  const [description, setDescription] = useState("");
  const [isPrivate, setPrivate] = useState<boolean>(true);
  const [maxSize, setSize] = useState<number>(10);
  const MAX_GROUP_NAME_LENGTH = 25;

  const isInvalidName = (name: string) => name.length === 0;
  const navigate = useNavigate();

  return (
    <>
      <Header pages={[{ label: "My Groups", url: "/" }]} />
      <InputGroup paddingInline={5}>
        <Stack>
          <Heading textAlign={"center"}>Create Group</Heading>
          <HStack>
            <Text mb={"8px"}>Name</Text>
            <Input
              value={name}
              placeholder={"name"}
              onInput={(e) =>
                setName({
                  field: e.currentTarget.value,
                  invalid: isInvalidName(e.currentTarget.value),
                })
              }
              isInvalid={invalidName}
              maxLength={MAX_GROUP_NAME_LENGTH}
            />
          </HStack>
          <Text
            color="grey.200"
            size="sm"
            align="right"
          >{`${name.length} / ${MAX_GROUP_NAME_LENGTH}`}</Text>
          <HStack>
            <Text mb={"8px"}>Description</Text>
            <Textarea
              value={description}
              placeholder={"Description"}
              onInput={(e) => setDescription(e.currentTarget.value)}
              isInvalid={invalidName}
            />
          </HStack>
          <GroupSizeSlider
            setSize={setSize}
            isPrivate={isPrivate}
            maxSize={maxSize}
          />
          <HStack>
            <Tooltip
              label="Private groups are only joinable through an invite link from a group member"
              hasArrow
            >
              <Text mb={"8px"}>Private Group:</Text>
            </Tooltip>
            <Checkbox
              isChecked={isPrivate}
              onChange={(e) => setPrivate(e.target.checked)}
            />
          </HStack>
          <Heading size="md"> Upload Banner</Heading>
          <FileDropzone parentCallback={handleCallback} />
          <Heading size="md"> Upload Profile Picture</Heading>
          <FileDropzone parentCallback={handleProfilePicSubmit} />
          <Button
            onClick={() => {
              if (user?.uid !== undefined) {
                createGroup(
                  {
                    description,
                    isPrivate,
                    name,
                    rides: {},
                    members: {},
                    owner: user?.uid,
                    maxSize,
                  },
                  user.uid
                ).then((group) => {
                  navigate(`/group/${group.id}`);
                  if (banner !== undefined) {
                    uploadPhoto(group.id, PhotoType.banners, banner).then(
                      (url) => {
                        setGroupBanner(group.id, url?.fullPath);
                      }
                    );
                  }
                  if (profilePic) {
                    uploadPhoto(
                      group.id,
                      PhotoType.profilePics,
                      profilePic
                    ).then((url) => {
                      setGroupProfilePic(group.id, url?.fullPath);
                    });
                  }
                });
              }
            }}
          >
            Create
          </Button>
        </Stack>
      </InputGroup>
    </>
  );
};

export default CreateGroup;
