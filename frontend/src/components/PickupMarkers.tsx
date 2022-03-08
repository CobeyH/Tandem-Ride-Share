import { Button, Heading } from "@chakra-ui/react";
import { Marker, Popup } from "react-leaflet";
import * as React from "react";
import {
  clearUserFromPickups,
  getUser,
  PickupPoint,
  setUserInPickup,
  usePickupPoint,
  User,
} from "../firebase/database";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";

const PickupMarkers = (props: {
  rideId: string;
  pickups: { [key: string]: PickupPoint } | undefined;
}) => {
  if (!props.pickups) return null;
  return (
    <>
      {Object.entries(props.pickups).map(([key, point]) => {
        if (!point.location) {
          return;
        }
        return <PickupMarker key={key} pickupId={key} rideId={props.rideId} />;
      })}
    </>
  );
};

const PickupMarker = ({
  pickupId,
  rideId,
}: {
  pickupId: string;
  rideId: string;
}) => {
  const [pickup] = usePickupPoint(rideId, pickupId);
  const [members, setMembers] = useState<User[]>();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!pickup?.members) setMembers(undefined);
    else {
      const userPromises = Object.keys(pickup.members).map((userId) => {
        return getUser(userId);
      });
      Promise.all(userPromises).then((users) => setMembers(users));
    }
  }, [pickup]);
  const inPickup =
    user?.uid && pickup?.members ? pickup.members[user.uid] : false;

  if (!pickup) return <></>;
  return (
    <Marker position={pickup.location}>
      <Popup>
        {members?.map((member: User, i: number) => (
          <Heading size={"sm"} key={i}>
            {member.name}
          </Heading>
        ))}
        <Button
          onClick={() => {
            if (user?.uid) {
              clearUserFromPickups(rideId, user.uid);
              setUserInPickup(rideId, pickupId, user.uid, !inPickup);
            }
          }}
        >
          {inPickup ? "Leave" : "Join"}
        </Button>
      </Popup>
    </Marker>
  );
};

export default PickupMarkers;
