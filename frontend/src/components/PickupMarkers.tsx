import { Button } from "@chakra-ui/react";
import { Marker, Popup } from "react-leaflet";
import * as React from "react";
import { PickupPoint } from "../firebase/database";

const PickupMarkers = (props: {
  pickups: { [key: string]: PickupPoint } | undefined;
}) => {
  if (!props.pickups) {
    return null;
  }

  return (
    <>
      {Object.entries(props.pickups).map(([key, point]) => {
        if (!point.location) {
          return;
        }
        return (
          <Marker key={key} position={point.location}>
            <Popup>
              <Button>Join</Button>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default PickupMarkers;
