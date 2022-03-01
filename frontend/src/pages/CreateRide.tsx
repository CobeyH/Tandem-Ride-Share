import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  Heading,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  auth,
  db,
  DB_GROUP_COLLECT,
  DB_KEY_SLUG_OPTS,
  DB_PASSENGERS_COLLECT,
  DB_RIDE_COLLECT,
  Vehicle,
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
import { LatLng, latLngBounds } from "leaflet";
import ChooseCar from "../components/ChooseCar";
import CarStatsSlider from "../components/CarStatsSlider";

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
    field: "",
    invalid: false,
  });
  const isInvalidTitle = (name: string) => name.length === 0;

  const [startPosition, setStartPosition] = useState<LatLng>(DEFAULT_CENTER);
  const [endPosition, setEndPosition] = useState<LatLng>(DEFAULT_CENTER);
  const [hasDragged, setHasDragged] = useState(false);
  const [map, setMap] = useState<L.Map | undefined>(undefined);
  const [isDriver, setIsDriver] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Vehicle | undefined>(
    undefined
  );

  function onDragStart(position: LatLng) {
    setStartPosition(position);
    setHasDragged(true);
    map?.invalidateSize();
    map?.fitBounds(latLngBounds([startPosition, endPosition]));
  }
  function onDragEnd(position: LatLng) {
    setEndPosition(position);
    setHasDragged(true); // enable 'Create' button after user move the icon
    map?.invalidateSize();
    map?.fitBounds(latLngBounds([startPosition, endPosition]));
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!isDriver) {
      setSelectedCar(undefined);
    }
    console.log("selected car", selectedCar);
  }, [isDriver]);

  return (
    <>
      <Header
        pages={[
          { label: "Group List", url: "/" },
          { label: "Group", url: `/group/${groupId}` },
        ]}
      />
      <Container>
        <Heading textAlign={"center"}>Create Ride</Heading>
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
          <Checkbox
            isChecked={isDriver}
            onChange={(e) => {
              setIsDriver(e.target.checked);
            }}
          >
            Are you the driver?
          </Checkbox>
          {isDriver ? <ChooseCar carUpdate={setSelectedCar} /> : null}
          {selectedCar && isDriver ? (
            <CarStatsSlider
              car={selectedCar}
              updateCar={setSelectedCar}
              isDisabled={true}
            />
          ) : null}
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
                  maxPassengers: selectedCar?.numSeats || 4,
                  ...(isDriver && { driver: user.uid }),
                };
                createRide(ride, groupId).then(() =>
                  navigate(`/group/${groupId}`)
                );
              }
            }}
          >
            Confirm
          </Button>
        </InputGroup>
        <MapView style={{ height: "50vh" }} setMap={setMap}>
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
