import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button, Heading, Input, InputGroup, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ref, push } from "firebase/database";
import { Ride, defaultMapCenter } from "./RidePage";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

type ValidatableFiled<T> = {
  field: T;
  invalid: boolean;
};

const createRide = async (ride: Ride) => await push(ref(db, "rides"), ride);

const CreateGroup = () => {
  const [user] = useAuthState(auth);
  const [{ field: title, invalid: invalidTitle }, setTitle] = useState<
    ValidatableFiled<string>
  >({
    field: user ? user.displayName + "'s Ride" : "",
    invalid: false,
  });

  const isInvalidTitle = (name: string) => name.length === 0;
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
            createRide({ title, start: [0, 0], end: [0, 0] }).then((id) => {
              navigate(`/ride/${id}`);
            });
          }}
        >
          Create
        </Button>
      </InputGroup>
      <MapContainer center={defaultMapCenter} zoom={12} scrollWheelZoom={false}>
        <DraggableMarker />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </>
  );
};

export default CreateGroup;

function DraggableMarker() {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState(defaultMapCenter);
  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? "Marker is draggable"
            : "Click here to make marker draggable"}
        </span>
      </Popup>
    </Marker>
  );
}
