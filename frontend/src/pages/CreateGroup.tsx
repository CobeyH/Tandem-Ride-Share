import React, { useState } from "react";
import { Button, Heading, Input, InputGroup, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { Group } from "./GroupsListPage";

type ValidatableFiled<T> = {
  field: T;
  invalid: boolean;
};

const createGroup = async (group: Group) =>
  await set(ref(db, `groups/${group.id}`), group);

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
              const id = `${user.uid}_${name}`;

              createGroup({ id, name, rides: [], members: [user?.uid] }).then(
                () => {
                  console.log("hello");
                  navigate(`/group/${id}`);
                }
              );
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
