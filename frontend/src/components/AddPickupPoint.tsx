import { Button } from "@chakra-ui/react";
import { latLng } from "leaflet";
import * as React from "react";
import { getOptimizedRoute } from "../Directions";
import {
  addPickupToRide,
  getRide,
  PickupPoint,
  setRidePassenger,
  setRoute,
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
    addPickupToRide(props.rideId, newPoint)
      .then(() => getRide(props.rideId))
      .then((ride) => {
        const routePoints = [latLng(ride.pickupPoints[ride.start].location)];
        Object.keys(ride.pickupPoints).map((p) => {
          if (p === ride.start) return;
          routePoints.push(latLng(ride.pickupPoints[p].location));
        });
        routePoints.push(latLng(ride.end));
        return getOptimizedRoute(routePoints);
      })
      .then((route) => {
        setRoute(props.rideId, route);
      })
      .catch((err) => console.log(err));
    setRidePassenger(props.userId, props.rideId);
  }

  return <Button onClick={getLocation}>Add new pickup</Button>;
};

export default AddPickupPoint;
