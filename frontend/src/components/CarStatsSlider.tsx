import {
  Heading,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { FaCarSide, FaShuttleVan, FaGasPump } from "react-icons/fa";
import { Vehicle } from "../firebase/firebase";

const CarStatsSlider = (props: {
  isDisabled?: boolean;
  car: Vehicle;
  updateCar: (car: Vehicle) => void;
}) => {
  return (
    <>
      <Heading as="h2" size="l">
        Number of Seats
      </Heading>
      <Slider
        id="slider"
        onChange={(value) => props.updateCar({ ...props.car, numSeats: value })}
        value={props.car.numSeats}
        min={1}
        max={12}
        isDisabled={props.isDisabled}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="right"
          isOpen={true}
          label={`${props.car.numSeats} Seats`}
        >
          <SliderThumb boxSize={6}>
            <Box
              color="tomato"
              as={props.car.numSeats < 6 ? FaCarSide : FaShuttleVan}
            />
          </SliderThumb>
        </Tooltip>
      </Slider>
      <Heading as="h2" size="l">
        Fuel Usage
      </Heading>
      <Slider
        onChange={(value) =>
          props.updateCar({ ...props.car, fuelUsage: value })
        }
        value={props.car.fuelUsage}
        min={5}
        max={20}
        isDisabled={props.isDisabled}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="right"
          isOpen={true}
          label={`${props.car.fuelUsage} L/100km`}
        >
          <SliderThumb boxSize={6}>
            <Box color="tomato" as={FaGasPump} />
          </SliderThumb>
        </Tooltip>
      </Slider>
    </>
  );
};

export default CarStatsSlider;
