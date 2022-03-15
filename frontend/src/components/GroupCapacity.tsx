import * as React from "react";
import { Group } from "../firebase/database";
import { Text } from "@chakra-ui/react";
import { groupMaxSize } from "./Promotional/PriceSelector";

const GroupCapacity = (props: { group: Group }) => {
  return (
    <Text>
      {Object.keys(props.group.members).length} /
      {groupMaxSize(props.group.plan)}
    </Text>
  );
};

export default GroupCapacity;
