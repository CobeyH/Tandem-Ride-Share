import * as React from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { Group, setGroupMember } from "../../firebase/database";
import { groupMaxSize } from "../Promotional/PriceSelector";

const GroupJoinButton = (props: {
  group: Group;
  userId: string | undefined;
}) => {
  const navigate = useNavigate();
  return (
    <Button
      isDisabled={
        // People cannot join full groups
        Object.keys(props.group.members).length >=
        groupMaxSize(props.group.plan)
      }
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
