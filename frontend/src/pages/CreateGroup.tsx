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
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import {
  DBConstants,
  getGroup,
  Group,
  setGroup,
  setGroupBanner,
} from "../firebase/database";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import Header from "../components/Header";
import DropZone, { storage } from "../firebase/storage";
import { uploadBytes } from "firebase/storage";
import { ref as storRef } from "firebase/storage";
import GroupSizeSlider from "../components/GroupSizeSlider";

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

  const handleCallback = (childBanner: Blob | MediaSource) => {
    setBanner(childBanner);
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
  const MAX_NAME_LENGTH = 25;

  const invalidLength = name.length > MAX_NAME_LENGTH;
  const isInvalidName = (name: string) => name.length === 0;
  const navigate = useNavigate();

  const uploadBanner = async (groupId: string) => {
    if (!banner) {
      return;
    }
    const blobUrl = URL.createObjectURL(banner);
    const blob = await fetch(blobUrl).then((r) => r.blob());
    const imageRef = storRef(storage, `banners/${groupId}`);
    await uploadBytes(imageRef, blob);
    return imageRef;
  };

  return (
    <>
      <Header pages={[{ label: "Group List", url: "/" }]} />
      <InputGroup paddingInline={5}>
        <Stack>
          <Heading textAlign={"center"}>Create Group</Heading>
          <HStack>
            <FormControl isInvalid={invalidLength}>
              <Text mb={"8px"}>Name</Text>
              <Input
                value={name}
                placeholder={"name"}
                onInput={(e) => {
                  setName({
                    field: e.currentTarget.value,
                    invalid: isInvalidName(e.currentTarget.value),
                  });
                }}
                isInvalid={invalidName}
              />
              {invalidLength && (
                <FormErrorMessage>
                  {`Group name should be under ${MAX_NAME_LENGTH} characters`}
                </FormErrorMessage>
              )}
            </FormControl>
          </HStack>
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
            <Text mb={"8px"}>Private Group:</Text>
            <Checkbox
              isChecked={isPrivate}
              onChange={(e) => setPrivate(e.target.checked)}
            />
          </HStack>
          <DropZone parentCallback={handleCallback} />
          <Button
            onClick={() => {
              if (invalidLength) {
                alert(
                  `Group name should be under ${MAX_NAME_LENGTH} characters`
                );
              } else {
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
                      uploadBanner(group.id).then((url) => {
                        setGroupBanner(group.id, url?.fullPath);
                      });
                    }
                  });
                }
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
