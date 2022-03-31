import {
  Heading,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Box,
  HStack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsQuestionCircleFill } from "react-icons/all";
import { FaCarSide, FaShuttleVan, FaGasPump } from "react-icons/fa";
import { Vehicle } from "../../firebase/database";
import { lightTheme } from "../../theme/colours";

const CarStatsSlider = (props: {
  isDisabled?: boolean;
  car: Vehicle;
  updateCar: (car: Vehicle) => void;
}) => {
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  return (
    <>
      <Heading as="h2" size="l" mt={2} textAlign="left">
        Number of Seats
      </Heading>
      <Text textAlign="left" variant="help-text">
        Total number of seats including driver.
      </Text>
      <HStack>
        <Slider
          id="slider"
          onChange={(value) =>
            props.updateCar({ ...props.car, numSeats: value })
          }
          value={props.car.numSeats}
          min={1}
          max={12}
          isDisabled={props.isDisabled}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Box
              color="tomato"
              as={props.car.numSeats < 6 ? FaCarSide : FaShuttleVan}
            />
          </SliderThumb>
        </Slider>
        <Box pl={3}>{props.car.numSeats}</Box>
      </HStack>
      <HStack
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
        onTouchStart={() => setTooltipOpen(true)}
        onTouchEnd={() => setTooltipOpen(false)}
      >
        <Tooltip
          isOpen={tooltipOpen}
          label="L/100km"
          hasArrow
          bg={lightTheme.darkButton}
          placement="right"
        >
          <Heading as="h2" size="l">
            Fuel Usage
          </Heading>
        </Tooltip>
        <BsQuestionCircleFill />
      </HStack>
      <HStack>
        <Slider
          onChange={(value) =>
            props.updateCar({ ...props.car, fuelUsage: value })
          }
          value={props.car.fuelUsage}
          max={20}
          isDisabled={props.isDisabled}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Box color="tomato" as={FaGasPump} />
          </SliderThumb>
        </Slider>
        <Box>{props.car.fuelUsage}</Box>
      </HStack>
    </>
  );
};

export default CarStatsSlider;
