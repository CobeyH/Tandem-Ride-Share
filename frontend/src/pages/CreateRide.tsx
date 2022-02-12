import React, { useMemo, useRef, useState } from "react";
import { Button, Heading, Input, InputGroup, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  auth,
  db,
  DB_GROUP_COLLECT,
  DB_GROUP_RIDES_FIELD,
  DB_RIDE_COLLECT,
} from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { ref, set, get, query } from "firebase/database";
import { defaultMapCenter } from "./RidePage";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { icon } from "leaflet";
import startIconImg from "../images/Arrow Circle Up_8.png";
import endIconImg from "../images/Arrow Circle Down_8.png";
import slugify from "react-slugify";

type ValidatableField<T> = {
  field: T;
  invalid: boolean;
};

export type Ride = {
  id: string;
  name: string;
  start: [number, number];
  end: [number, number];
};

const createRide = async (ride: Ride, groupId: string) => {
  ride.id = slugify(ride.name);
  if ((await get(query(ref(db, `${DB_GROUP_COLLECT}/${ride.id}`)))).exists()) {
    /* TODO: increment id */
    throw new Error("Group ID already exists");
  }
  await set(ref(db, `${DB_RIDE_COLLECT}/${ride.id}`), ride);
  await set(ref(db, `${DB_GROUP_RIDES_FIELD}/${ride.id}`), true);
  return ride;
};

const CreateRide = () => {
  const { groupId } = useParams();
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

  const startIcon = icon({
    iconUrl: startIconImg,
    iconSize: [96, 96],
    iconAnchor: [48, 92],
  });
  const endIcon = icon({
    iconUrl: endIconImg,
    iconSize: [96, 96],
    iconAnchor: [48, 92],
  });

  return (
    <>
      <Heading>Create Ride</Heading>
      <InputGroup>
        <Text mb={"8px"}>Title</Text>
        <Input
          value={title}
          placeholder={"Ride Name"}
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
            if (groupId) {
              const ride = {
                id: "",
                name: title,
                start: startPosition,
                end: endPosition,
              };
              createRide(ride, groupId).then(() =>
                navigate(`/group/${groupId}`)
              );
            }
          }}
        >
          Create
        </Button>
      </InputGroup>
      <MapContainer center={defaultMapCenter} zoom={12} scrollWheelZoom={false}>
        <DraggableMarker onDragEnd={onDragStart} icon={startIcon} />
        <DraggableMarker onDragEnd={onDragEnd} icon={endIcon} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </>
  );
};

export default CreateRide;

interface MarkerProperties {
  onDragEnd: (position: L.LatLng) => void;
  icon: L.Icon;
}

const DraggableMarker = (props: MarkerProperties) => {
  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          props.onDragEnd(marker.getLatLng());
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
      icon={props.icon}
    />
  );
};
