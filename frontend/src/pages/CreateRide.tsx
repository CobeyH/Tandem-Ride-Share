import React, { useMemo, useRef, useState } from "react";
import { Button, Heading, Input, InputGroup, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ref, push, set } from "firebase/database";
import { Ride, defaultMapCenter } from "./RidePage";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

type ValidatableField<T> = {
  field: T;
  invalid: boolean;
};

const ridesRef = ref(db, "rides");
const createRide = async (ride: Ride) => {
  const newRideRef = push(ridesRef);
  await set(newRideRef, ride);
  return newRideRef.key;
};

const CreateGroup = () => {
  const [user] = useAuthState(auth);
  const [{ field: title, invalid: invalidTitle }, setTitle] = useState<
    ValidatableField<string>
  >({
    field: user ? user.displayName + "'s Ride" : "",
    invalid: false,
  });
  const isInvalidTitle = (name: string) => name.length === 0;

  const [startPosition, setStartPosition] = useState<[number, number]>([0, 0]);
  const [endPosition, setEndPosition] = useState<[number, number]>([0, 0]);
  function onDragStart(position: L.LatLng) {
    setStartPosition([position.lat, position.lng]);
  }
  function onDragEnd(position: L.LatLng) {
    setEndPosition([position.lat, position.lng]);
  }

  const navigate = useNavigate();

  return (
    <>
      <Heading>Create Ride</Heading>
      <InputGroup>
        <Text mb={"8px"}>Title</Text>
        <Input
          value={title}
          placeholder={"Title"}
          onInput={(e) =>
            setTitle({
              field: e.currentTarget.value,
              invalid: isInvalidTitle(e.currentTarget.value),
            })
          }
          isInvalid={invalidTitle}
        />
        <Button
          onClick={() => {
            createRide({ title, start: startPosition, end: endPosition }).then(
              (id) => {
                navigate(`/ride/${id}`);
              }
            );
          }}
        >
          Create
        </Button>
      </InputGroup>
      <MapContainer center={defaultMapCenter} zoom={12} scrollWheelZoom={false}>
        <DraggableMarker onDragEnd={onDragEnd} />
        <DraggableMarker onDragEnd={onDragStart} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </>
  );
};

export default CreateGroup;

interface PositionCallback {
  onDragEnd: (position: L.LatLng) => void;
}

const DraggableMarker = ({ onDragEnd }: PositionCallback) => {
  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          onDragEnd(marker.getLatLng());
        }
      },
    }),
    []
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={defaultMapCenter}
      ref={markerRef}
    />
  );
};
