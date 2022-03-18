import * as React from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  CloseButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { Group, setGroupMember } from "../../firebase/database";
import { groupMaxSize } from "../Promotional/PriceSelector";

const GroupJoinButton = (props: {
  group: Group;
  userId: string | undefined;
}) => {
  const navigate = useNavigate();
  const groupIsFull = // People cannot join full groups
    Object.keys(props.group.members).length >= groupMaxSize(props.group.plan);

  return (
    <>
      <Button
        isDisabled={groupIsFull}
        onClick={() => {
          if (props.userId === undefined) return;
          setGroupMember(props.group.id, props.userId).then(() => {
            navigate(`/group/${props.group.id}`);
          });
        }}
      >
        Join
      </Button>
      {groupIsFull ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>This group is full!</AlertTitle>
          <AlertDescription>
            Ask the group administrator to upgrade their plan.
          </AlertDescription>
        </Alert>
      ) : null}
    </>
  );
};

export default GroupJoinButton;
