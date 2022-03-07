import {
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import * as React from "react";
import { RiMapPin2Fill } from "react-icons/all";

const PickupPoint = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton aria-label="pickup-point" as={RiMapPin2Fill} />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Pickup Point</PopoverHeader>
        <PopoverBody>Temp Text</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PickupPoint;
