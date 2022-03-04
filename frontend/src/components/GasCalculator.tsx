import * as React from "react";
import { Heading, VStack } from "@chakra-ui/react";
import { db, DB_PASSENGERS_COLLECT } from "../firebase";
import { query, ref } from "firebase/database";
import { useList } from "react-firebase-hooks/database";

const GasCalculator = (props: {
  fuelUsage: number | undefined;
  distance: number | undefined;
  rideId: string;
}) => {
  const gasPrice = 1.95; //TODO: Get real value
  const [passVals, passLoading, passError] = useList(
    query(ref(db, `${DB_PASSENGERS_COLLECT}/${props.rideId}`))
  );
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
