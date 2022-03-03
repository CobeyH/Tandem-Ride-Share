import * as React from "react";
import { Button } from "@chakra-ui/react";
import { setGroupMember } from "../firebase/database";
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
        if (props.userId === undefined) return;
        setGroupMember(props.group.id, props.userId).then(() => {
          navigate(`/group/${props.group.id}`);
        });
      }}
    >
      Join
    </Button>
  );
};

export default GroupJoinButton;
