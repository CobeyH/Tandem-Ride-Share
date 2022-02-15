import React, { useState } from "react";
import {
  Button,
  Heading,
  Input,
  InputGroup,
  Text,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, DB_GROUP_COLLECT, DB_KEY_SLUG_OPTS } from "../firebase";
import { useNavigate } from "react-router-dom";
import { get, query, ref, set } from "firebase/database";
import slugify from "slugify";
import Header from "./Header";
import DropZone, { storage } from "../storage";
import { uploadBytes } from "firebase/storage";
import { ref as storRef } from "firebase/storage";

type ValidatableFiled<T> = {
  field: T;
  invalid: boolean;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  rides: string[];
  members: { [key: string]: boolean };
};

const createGroup = async (group: Group, userId: string) => {
  group.id = slugify(group.name, DB_KEY_SLUG_OPTS);

  if ((await get(query(ref(db, `${DB_GROUP_COLLECT}/${group.id}`)))).exists()) {
    /* TODO: increment id */
    throw new Error("Group ID already exists");
  }
  group.members[userId] = true;
  await set(ref(db, `${DB_GROUP_COLLECT}/${group.id}`), group);
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
    field: user ? user.displayName + "'s Group" : "",
    invalid: false,
  });
  const [description, setDescription] = useState("");

  const isInvalidName = (name: string) => name.length === 0;
  const navigate = useNavigate();

  const uploadBanner = async (groupId: string) => {
    if (!banner) {
      return;
    }
    const blobUrl = URL.createObjectURL(banner);
    const blob = await fetch(blobUrl).then((r) => r.blob());
    const imageRef = storRef(storage, `${groupId}`);
    uploadBytes(imageRef, blob);
  };

  return (
    <>
      <Header pages={[{ label: "Group List", url: "/" }]} />
      <InputGroup paddingInline={5}>
        <Stack>
          <Heading>Create Group</Heading>
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
            />
          </HStack>
          <HStack>
            <Text mb={"8px"}>Description</Text>
            <Input
              value={description}
              placeholder={"description"}
              onInput={(e) => setDescription(e.currentTarget.value)}
              isInvalid={invalidName}
            />
          </HStack>
          <DropZone parentCallback={handleCallback} />
          <Button
            onClick={() => {
              if (user?.uid !== undefined) {
                createGroup(
                  { id: "", description, name, rides: [], members: {} },
                  user.uid
                ).then((group) => {
                  navigate(`/group/${group.id}`);
                  uploadBanner(group.id).then(() => alert("file uploaded"));
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
