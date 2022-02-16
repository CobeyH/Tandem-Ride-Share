import React, { useMemo, useRef, useState } from "react";
import { Button, Heading, Input, InputGroup, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  auth,
  db,
  DB_GROUP_COLLECT,
  DB_KEY_SLUG_OPTS,
  DB_RIDE_COLLECT,
} from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { ref, set, get, query } from "firebase/database";
import { Marker } from "react-leaflet";
import slugify from "slugify";
import Header from "../components/Header";
import MapView, {
  DEFAULT_CENTER,
  endIcon,
  startIcon,
} from "../components/MapView";

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
  ride.id = slugify(ride.name, DB_KEY_SLUG_OPTS);
  if ((await get(query(ref(db, `${DB_GROUP_COLLECT}/${ride.id}`)))).exists()) {
    /* TODO: increment id */
    throw new Error("Group ID already exists");
  }
  await set(ref(db, `${DB_RIDE_COLLECT}/${groupId}/${ride.id}`), ride);
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

  return (
    <>
      <Header
        pages={[
          { label: "Group List", url: "/" },
          { label: "Group", url: `/group/${groupId}` },
        ]}
      />
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
      <MapView>
        <DraggableMarker onDragEnd={onDragStart} icon={startIcon} />
        <DraggableMarker onDragEnd={onDragEnd} icon={endIcon} />
      </MapView>
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
      position={DEFAULT_CENTER}
      ref={markerRef}
      icon={props.icon}
    />
  );
};
