import { Button } from "@chakra-ui/react";
import { latLng } from "leaflet";
import * as React from "react";
import { getOptimizedRoute, getReverseGeocodeAsString } from "../../Directions";
import {
  addPickupToRide,
  clearUserFromPickups,
  getRide,
  PickupPoint,
  setRoute,
  setUserInPickup,
} from "../../firebase/database";
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

  async function newPickupPoint(position: { lat: number; lng: number }) {
    const newPoint: PickupPoint = {
      members: {},
      location: {
        lat: position.lat,
        lng: position.lng,
      },
    };
    newPoint.members[props.userId] = true;
    await getReverseGeocodeAsString(latLng(position.lat, position.lng)).then(
      (geocode) => {
        newPoint.geocode = geocode;
      }
    );
    addPickupToRide(props.rideId, newPoint)
      .then((ref) => {
        if (ref.key) {
          clearUserFromPickups(props.rideId, props.userId);
          setUserInPickup(props.rideId, ref.key, props.userId);
        }
      })
      .then(() => getRide(props.rideId))
      .then((ride) => {
        // Fetch optimized route for new points
        const routePoints = [latLng(ride.pickupPoints[ride.start].location)];
        Object.keys(ride.pickupPoints).map((k) => {
          if (k === ride.start) return;
          routePoints.push(latLng(ride.pickupPoints[k].location));
        });
        routePoints.push(latLng(ride.end));
        return getOptimizedRoute(routePoints);
      })
      .then((route) => {
        setRoute(props.rideId, route);
      })
      .catch((err) => console.log(err));
  }

  return <Button onClick={getLocation}>Add new pickup</Button>;
};

export default AddPickupPoint;
