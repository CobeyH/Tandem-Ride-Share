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

  // const [pickupMembers, setPickupMembers] = useState();
  // const userPromises = Object.keys(props.p).map((userId) => {
  //   return getUser(userId);
  // });
  // Promise.all(userPromises).then((users) => setGroupMembers(users));

  return (
    <>
      {Object.entries(props.pickups).map(([key, point]) => {
        if (!point.location) {
          return;
        }
        return (
          <PickupMarker
            key={key}
            pickupId={key}
            point={point}
            rideId={props.rideId}
            userId={props.userId}
          />
        );
      })}
    </>
  );
};

const PickupMarker = (props: {
  pickupId: string;
  point: {
    location: { lat: number; lng: number };
  };
  rideId: string;
  userId: string | undefined;
}) => {
  return (
    <Marker position={props.point.location}>
      <Popup onOpen={() => console.log("test 1")}>
        <Button
          onClick={() => {
            setUserInPickup(props.rideId, props.pickupId, props.userId ?? "");
          }}
        >
          Join
        </Button>
      </Popup>
    </Marker>
  );
};

export default PickupMarkers;
