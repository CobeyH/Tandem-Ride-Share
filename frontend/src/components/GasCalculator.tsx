import * as React from "react";
import { Heading, VStack } from "@chakra-ui/react";
import { useRidePassengers } from "../firebase/database";

const GasCalculator = (props: {
  fuelUsage: number | undefined;
  distance: number | undefined;
  rideId: string;
}) => {
  const gasPrice = 1.95; //TODO: Get real value
  const [passVals, passLoading, passError] = useRidePassengers(props.rideId);
  if (!props.fuelUsage || !props.distance) {
    return null;
  }
  const tripCost = ((props.distance * props.fuelUsage) / 100) * gasPrice;
  return (
    <VStack>
      <Heading size="sm">Fuel Cost: {"$" + tripCost.toFixed(2)}</Heading>
      <Heading size="sm">
        Cost Per Person:
        {passLoading || passError || !passVals
          ? null
          : "$" + (tripCost / (passVals?.length + 1)).toFixed(2)}
      </Heading>
    </VStack>
  );
};

export default GasCalculator;
