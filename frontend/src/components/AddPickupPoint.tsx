import { Button } from "@chakra-ui/react";
import * as React from "react";
import {
  addPickupToRide,
  PickupPoint,
  setRidePassenger,
} from "../firebase/database";

const AddPickupPoint = (props: { userId: string; rideId: string }) => {
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }

  function showPosition(position: {
    coords: { latitude: number; longitude: number };
  }) {
    const newPoint: PickupPoint = {
      members: {},
      location: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
    };
    newPoint.members[props.userId] = true;
    addPickupToRide(props.rideId, newPoint);
    setRidePassenger(props.userId, props.rideId);
  }

  return <Button onClick={getLocation}>Add new pickup</Button>;
};

export default AddPickupPoint;
