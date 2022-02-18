import React, { useMemo, useRef, useState } from "react";
import {
  Button,
  Container,
  Heading,
  Input,
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  auth,
  db,
  DB_GROUP_COLLECT,
  DB_KEY_SLUG_OPTS,
  DB_PASSENGERS_COLLECT,
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
import { LatLng } from "leaflet";

type ValidatableField<T> = {
  field: T;
  invalid: boolean;
};

export type Ride = {
  id: string;
  name: string;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  maxPassengers: number;
  driver?: string;
};

const createRide = async (ride: Ride, groupId: string, passList?: string[]) => {
  ride.id = slugify(ride.name, DB_KEY_SLUG_OPTS);
  if ((await get(query(ref(db, `${DB_RIDE_COLLECT}/${ride.id}`)))).exists()) {
    /* TODO: increment id */
    throw new Error("Ride ID already exists");
  }
  await set(ref(db, `${DB_RIDE_COLLECT}/${ride.id}`), ride);
  await set(ref(db, `${DB_GROUP_COLLECT}/${groupId}/rides/${ride.id}`), true);
  if (passList) {
    await Promise.all(
      passList.map(async (p) => {
        await set(ref(db, `${DB_PASSENGERS_COLLECT}/${ride.id}/${p}`), true);
      })
    );
  }

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

  const [startPosition, setStartPosition] = useState<LatLng>(DEFAULT_CENTER);
  const [endPosition, setEndPosition] = useState<LatLng>(DEFAULT_CENTER);
  const [hasDragged, setHasDragged] = useState(false);

  function onDragStart(position: LatLng) {
    setStartPosition(position);
    setHasDragged(true);
  }
  function onDragEnd(position: LatLng) {
    setEndPosition(position);
    setHasDragged(true); // enable 'Create' button after user move the icon
  }

  const [maxPassengers, setMaxPassengers] = useState<number>(3);

  const navigate = useNavigate();

  return (
    <>
      <Header
        pages={[
          { label: "Group List", url: "/" },
          { label: "Group", url: `/group/${groupId}` },
        ]}
      />
      <Container>
        <Heading>Create Ride</Heading>
        <InputGroup flexDirection="column">
          <Input
            mt={4}
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
          <NumberInput
            mt={4}
            defaultValue={3}
            min={1}
            max={9}
            onChange={(_, num) => setMaxPassengers(num)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Button
            mt={4}
            disabled={!hasDragged}
            onClick={() => {
              if (groupId && user) {
                const ride = {
                  id: "",
                  name: title,
                  start: startPosition,
                  end: endPosition,
                  maxPassengers: maxPassengers,
                };
                createRide(ride, groupId, [user.uid]).then(() =>
                  navigate(`/group/${groupId}`)
                );
              }
            }}
          >
            Create Ride as Passenger
          </Button>
          <Button
            mt={4}
            mb={4}
            disabled={!hasDragged}
            onClick={() => {
              if (groupId && user) {
                const ride = {
                  id: "",
                  name: title,
                  start: startPosition,
                  end: endPosition,
                  maxPassengers: maxPassengers,
                  driver: user.uid,
                };
                createRide(ride, groupId).then(() =>
                  navigate(`/group/${groupId}`)
                );
              }
            }}
          >
            Create Ride as Driver
          </Button>
        </InputGroup>
        <MapView style={{ height: "50vh" }}>
          <DraggableMarker onDragEnd={onDragStart} icon={startIcon} />
          <DraggableMarker onDragEnd={onDragEnd} icon={endIcon} />
        </MapView>
      </Container>
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
