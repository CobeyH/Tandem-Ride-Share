import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
} from "@chakra-ui/react";
import * as React from "react";
import { MdGraphicEq } from "react-icons/md";
import { lightTheme } from "../theme/colours";

const GroupSizeSlider = (props: {
  maxSize: number;
  setSize: (size: number) => void;
}) => {
  return (
    <Slider aria-label="group-size" defaultValue={10} value={props.maxSize}>
      <SliderTrack bg={lightTheme.lightButton}>
        <SliderFilledTrack bg={lightTheme.darkButton} />
      </SliderTrack>
      <SliderThumb boxSize={6}>
        <Box color="tomato" as={MdGraphicEq} />
      </SliderThumb>
    </Slider>
  );
};

export default GroupSizeSlider;
