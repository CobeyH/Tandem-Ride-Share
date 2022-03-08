import * as React from "react";
import { Group } from "../firebase/database";
import { Text } from "@chakra-ui/react";

const GroupCapacity = (props: { group: Group }) => {
  return (
    <Text>
      {Object.keys(props.group.members).length} / {props.group.maxSize}
    </Text>
  );
};

export default GroupCapacity;
