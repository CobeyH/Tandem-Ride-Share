import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  Heading,
  Input,
  InputGroup,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import {
  Ride,
  setGroupRide,
  setRide,
  setRidePassenger,
  setRoute,
  Vehicle,
} from "../firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import { Marker } from "react-leaflet";
import Header from "../components/Header";
import MapView, {
  DEFAULT_CENTER,
  endIcon,
  startIcon,
} from "../components/MapView";
import { LatLng, latLngBounds } from "leaflet";
import ChooseCar from "../components/ChooseCar";
import CarStatsSlider from "../components/CarStatsSlider";
import { getRideRoute } from "../Directions";

const createRide = async (
  ride: Ride,
  groupId: string,
  passList: string[] = []
) => {
  const rideId = (await setRide(ride)).id;
  if (rideId) {
    await setGroupRide(groupId, rideId);
    createRoute(rideId, ride);
    if (ride.driver) {
      passList.push(ride.driver);
    }
    await Promise.all(
      passList.map(async (p) => {
        setRidePassenger(p, rideId);
      })
    );
  }
  return ride;
};

const createRoute = async (rideId: string, ride: Ride) => {
  const route = await getRideRoute(ride.start as LatLng, ride.end as LatLng);
  if (route) setRoute(rideId, route);
  return route;
};

const CreateRide = () => {
  const { groupId } = useParams();
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState<string>("");

  const [startPosition, setStartPosition] = useState<LatLng>(DEFAULT_CENTER);
  const [endPosition, setEndPosition] = useState<LatLng>(DEFAULT_CENTER);
  const [map, setMap] = useState<L.Map | undefined>(undefined);
  const [isDriver, setIsDriver] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Vehicle | undefined>(
    undefined
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function onDragStart(position: LatLng) {
    setStartPosition(position);
    map?.invalidateSize();
    map?.fitBounds(latLngBounds([startPosition, endPosition]));
  }
  function onDragEnd(position: LatLng) {
    setEndPosition(position);
    map?.invalidateSize();
    map?.fitBounds(latLngBounds([startPosition, endPosition]));
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!isDriver) {
      setSelectedCar(undefined);
    }
  }, [isDriver]);

  const isValidTitle = (title: string) => title.length !== 0;
  const isValidStartAndEnd = (start: LatLng, end: LatLng) => start !== end;

  const isValidRide =
    isValidStartAndEnd(startPosition, endPosition) && isValidTitle(title);

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
            onInput={(e) => {
              setTitle(e.currentTarget.value);
            }}
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
        </InputGroup>
        <Text>Start Time</Text>
        <Input
          mb="4"
          type="datetime-local"
          onInput={(e) => setStartDate(e.currentTarget.value)}
        />
        <Text>End Time</Text>
        <Input
          mb="4"
          type="datetime-local"
          onInput={(e) => setEndDate(e.currentTarget.value)}
        />
        <MapView style={{ height: "50vh" }} setMap={setMap}>
          <DraggableMarker onDragEnd={onDragStart} icon={startIcon} />
          <DraggableMarker onDragEnd={onDragEnd} icon={endIcon} />
        </MapView>
        <Tooltip
          hasArrow
          label={
            isValidTitle(title)
              ? isValidStartAndEnd(startPosition, endPosition)
                ? "Create a ride"
                : "Need a valid start and end"
              : "Need a valid title"
          }
          bg="gray.300"
          color="black"
          shouldWrapChildren
          placement={"top"}
        >
          <Button
            variant={"solid"}
            mt={4}
            mb={4}
            disabled={!isValidRide}
            onClick={() => {
              if (groupId && user) {
                const ride = {
                  id: "",
                  name: title,
                  start: startPosition,
                  end: endPosition,
                  maxPassengers: selectedCar?.numSeats || 4,
                  startDate,
                  isComplete: false,
                  endDate,
                  ...(isDriver && { driver: user.uid }),
                  ...(selectedCar !== undefined && {
                    carId: selectedCar?.carId,
                  }),
                };
                createRide(ride, groupId).then(() =>
                  navigate(`/group/${groupId}`)
                );
              }
            }}
          >
            Confirm
          </Button>
        </Tooltip>
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
