import { Button } from "@chakra-ui/react";
import * as React from "react";

const AddPickupPoint = () => {
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }

  function showPosition(position: {
    coords: { latitude: number; longitude: number };
  }) {
    //TODO: Do something with this lat/long
    console.log(
      "Latitude: " +
        position.coords.latitude +
        " Longitude: " +
        position.coords.longitude
    );
  }

  return <Button onClick={getLocation}>Add new pickup</Button>;
};

export default AddPickupPoint;
