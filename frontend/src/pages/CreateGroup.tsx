import React, { useState } from "react";
import { Button, Heading, Input, InputGroup, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, DB_GROUP_COLLECT, DB_KEY_SLUG_OPTS } from "../firebase";
import { useNavigate } from "react-router-dom";
import { get, query, ref, set } from "firebase/database";
import slugify from "slugify";
import Header from "./Header";

type ValidatableFiled<T> = {
  field: T;
  invalid: boolean;
};

export type Group = {
  id: string;
  name: string;
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
  const [user] = useAuthState(auth);
  const [{ field: name, invalid: invalidName }, setName] = useState<
    ValidatableFiled<string>
  >({
    field: user ? user.displayName + "'s Group" : "",
    invalid: false,
  });

  const isInvalidName = (name: string) => name.length === 0;
  const navigate = useNavigate();

  return (
    <>
      <Header pages={[{ label: "Group List", url: "/" }]} />
      <Heading>Create Group</Heading>
      <InputGroup>
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
        <Button
          onClick={() => {
            if (user?.uid !== undefined) {
              createGroup(
                { id: "", name, rides: [], members: {} },
                user.uid
              ).then((group) => navigate(`/group/${group.id}`));
            }
          }}
        >
          Create
        </Button>
      </InputGroup>
    </>
  );
};

export default CreateGroup;
