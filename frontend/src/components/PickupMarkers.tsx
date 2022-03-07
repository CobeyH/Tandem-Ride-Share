import { Button, Heading } from "@chakra-ui/react";
import { Marker, Popup } from "react-leaflet";
import * as React from "react";
import {
  getUser,
  PickupPoint,
  setUserInPickup,
  User,
} from "../firebase/database";
import { useEffect, useState } from "react";

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
          <PickupMarker
            key={key}
            pickupId={key}
            point={point}
            rideId={props.rideId}
            userId={props.userId}
            memberIds={point.members}
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
  memberIds: { [key: string]: boolean };
}) => {
  const [members, setMembers] = useState<User[]>();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const userPromises = Object.keys(props.memberIds).map((userId) => {
      return getUser(userId);
    });
    Promise.all(userPromises).then((users) => setMembers(users));
  }, [open]);

  return (
    <Marker position={props.point.location}>
      <Popup
        onOpen={() => {
          setOpen(true);
        }}
      >
        {members?.map((member: User, i: number) => (
          <Heading size={"sm"} key={i}>
            {member.name}
          </Heading>
        ))}
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
