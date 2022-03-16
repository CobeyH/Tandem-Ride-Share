import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { FaUserAlt, FaUserPlus, FaUsers } from "react-icons/all";
import { lightTheme } from "../../theme/colours";

const GroupSizeSlider = (props: {
  maxSize: number;
  isPrivate: boolean;
  setSize: (size: number) => void;
}) => {
  // TODO: Need to decide on real values for these.
  const userCost = 0.5 * props.maxSize;
  const privateCost = props.isPrivate ? 1.5 : 1.0;
  const priceOver100 = props.isPrivate ? 0.65 : 0.45;
  const cost = props.maxSize === 10 ? 0 : userCost * privateCost;
  return (
    <>
      <Text>
        Max Group Size: {props.maxSize < 100 ? props.maxSize : "100+"}
      </Text>
      <Slider
        aria-label="group-size"
        defaultValue={10}
        value={props.maxSize}
        min={10}
        onChange={(value) => props.setSize(value)}
      >
        <SliderTrack bg={lightTheme.lightButton}>
          <SliderFilledTrack bg={lightTheme.darkButton} />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          <Box
            color={lightTheme.darkButton}
            as={
              props.maxSize === 10
                ? FaUserAlt
                : props.maxSize < 50
                ? FaUserPlus
                : FaUsers
            }
            size={12}
          />
        </SliderThumb>
      </Slider>
      <Text>
        Cost: ${props.maxSize < 100 ? cost : `${priceOver100} per person`}
      </Text>
    </>
  );
};

export default GroupSizeSlider;
