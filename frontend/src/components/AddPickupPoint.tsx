import { Button } from "@chakra-ui/react";
import * as React from "react";
import {
  addPickupToRide,
  PickupPoint,
  setRidePassenger,
} from "../firebase/database";
import { DEFAULT_CENTER } from "./MapView";

const AddPickupPoint = (props: { userId: string; rideId: string }) => {
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, errorPosition);
    }
  }

  function showPosition(position: GeolocationPosition) {
    newPickupPoint({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  }

  function errorPosition(error: GeolocationPositionError) {
    console.log(error);
    newPickupPoint(DEFAULT_CENTER);
  }

  function newPickupPoint(position: { lat: number; lng: number }) {
    const newPoint: PickupPoint = {
      members: {},
      location: {
        lat: position.lat,
        lng: position.lng,
      },
    };
    newPoint.members[props.userId] = true;
    addPickupToRide(props.rideId, newPoint);
    setRidePassenger(props.userId, props.rideId);
  }

  return <Button onClick={getLocation}>Add new pickup</Button>;
};

export default AddPickupPoint;
