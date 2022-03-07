import { Button } from "@chakra-ui/react";
import { Marker, Popup } from "react-leaflet";
import * as React from "react";
import { PickupPoint, setUserInPickup } from "../firebase/database";

const PickupMarkers = (props: {
  userId: string | undefined;
  rideId: string;
  pickups: { [key: string]: PickupPoint } | undefined;
}) => {
  if (!props.pickups || !props.userId) {
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
              <Button
                onClick={() => {
                  setUserInPickup(props.rideId, key, props.userId!);
                }}
              >
                Join
              </Button>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default PickupMarkers;
