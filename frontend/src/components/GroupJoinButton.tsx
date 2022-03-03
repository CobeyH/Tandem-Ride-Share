import * as React from "react";
import { Button } from "@chakra-ui/react";
import { set, ref } from "firebase/database";
import { db, DB_GROUP_COLLECT } from "../firebase/firebase";
import { Group } from "../pages/CreateGroup";
import { useNavigate } from "react-router";

const GroupJoinButton = (props: {
  group: Group;
  userId: string | undefined;
}) => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        set(
          ref(
            db,
            `${DB_GROUP_COLLECT}/${props.group.id}/members/${props.userId}`
          ),
          true
        ).then(() => {
          navigate(`/group/${props.group.id}`);
        });
      }}
    >
      Join
    </Button>
  );
};

export default GroupJoinButton;
