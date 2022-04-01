import * as React from "react";
import { Group } from "../../firebase/database";
import { Tag, Text } from "@chakra-ui/react";
import { groupMaxSize } from "../Promotional/PriceSelector";
import { styleColors } from "../../theme/colours";

// This renders a circle with a color depending on how full the group is.
const GroupCapacity = (props: { group: Group }) => {
  return (
    <Text>
      {Object.keys(props.group.members).length / groupMaxSize(props.group.plan)}
    </Text>
  );
};

interface FillBreakpoint {
  fillPoint: number;
  colour: string;
}

const breakpoints: Array<FillBreakpoint> = [
  {
    fillPoint: 0.4,
    colour: styleColors.mint,
  },
  {
    fillPoint: 0.7,
    colour: "#ED8936",
  },
  {
    fillPoint: 0.99,
    colour: "#E53E3E",
  },
];

export const GroupCapacityBadge = (props: { group: Group }) => {
  const fillLevel =
    Object.keys(props.group.members).length / groupMaxSize(props.group.plan);
  const breakPoint = breakpoints.find(
    (b: FillBreakpoint) => b.fillPoint >= fillLevel
  );
  return <Tag bg={breakPoint?.colour} borderRadius={15} />;
};

export default GroupCapacity;
