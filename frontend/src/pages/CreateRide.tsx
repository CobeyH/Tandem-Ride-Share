import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { Step, Steps, useSteps } from "chakra-ui-steps";
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
} from "../components/Rides/MapView";
import { LatLng, latLngBounds } from "leaflet";
import ChooseCar from "../components/Rides/ChooseCar";
import CarStatsSlider from "../components/Profiles/CarStatsSlider";
import { getReverseGeocodeAsString, getRideRoute } from "../Directions";
import { lightTheme } from "../theme/colours";
import LocationSearch from "../components/Rides/LocationSearch";
import VerifiedStep from "../components/VerifiedStep";

const createRide = async (
  ride: Ride,
  groupId: string,
  passList: string[] = []
) => {
  const rideId = (await setRide(ride)).id;
  if (rideId) {
    await setGroupRide(groupId, rideId);
    createRoute(rideId, ride);
    await Promise.all(
      passList.map(async (p) => {
        setRidePassenger(p, rideId);
      })
    );
  }
  return ride;
};

const createRoute = async (rideId: string, ride: Ride) => {
  const route = await getRideRoute(
    ride.pickupPoints[ride.start].location as LatLng,
    ride.end as LatLng
  );
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
  const [isDriver, setIsDriver] = useState<boolean | undefined>();
  const [selectedCar, setSelectedCar] = useState<Vehicle | undefined>(
    undefined
  );
  const [startDate, setStartDate] = useState("");
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

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
          { label: "My Groups", url: "/" },
          { label: "Group", url: `/group/${groupId}` },
        ]}
      />
      <Container>
        <Heading textAlign={"center"}>Create Ride</Heading>
        <Steps activeStep={activeStep} orientation="vertical">
          <VerifiedStep
            label="Name Ride"
            activeStep={activeStep}
            currentInput={title}
            isVerified={(title: string) => title.length !== 0}
            isFirstStep={true}
            nextStep={nextStep}
            prevStep={prevStep}
          >
            <Input
              mt={4}
              value={title}
              placeholder={"Ride Name"}
              onInput={(e) => {
                setTitle(e.currentTarget.value);
              }}
            />
          </VerifiedStep>
          <Step label="Are you the driver?">
            <HStack>
              <Button onClick={() => setIsDriver(false)}>Passenger</Button>
              <Button onClick={() => setIsDriver(true)}>Driver</Button>
            </HStack>
          </Step>
          {isDriver ? (
            <VerifiedStep
              label="Select Car"
              activeStep={activeStep}
              currentInput={selectedCar}
              isVerified={(car: Vehicle | undefined) => car !== undefined}
              nextStep={nextStep}
              prevStep={prevStep}
            >
              <ChooseCar carUpdate={setSelectedCar} />
              {selectedCar ? (
                <CarStatsSlider
                  car={selectedCar}
                  updateCar={setSelectedCar}
                  isDisabled={true}
                />
              ) : null}
            </VerifiedStep>
          ) : null}
          <Step label="Start Time">
            <Input
              mb="4"
              type="datetime-local"
              onInput={(e) => setStartDate(e.currentTarget.value)}
            />
          </Step>
          <Step label="Create Route">
            <Text>Start Location</Text>
            <LocationSearch setLatLng={setStartPosition} />
            <Text>End Location</Text>
            <LocationSearch setLatLng={setEndPosition} />
            <MapView style={{ height: "50vh" }} setMap={setMap}>
              <DraggableMarker
                position={startPosition}
                onDragEnd={onDragStart}
                icon={startIcon}
              />
              <DraggableMarker
                position={endPosition}
                onDragEnd={onDragEnd}
                icon={endIcon}
              />
            </MapView>
          </Step>
        </Steps>
        <InputGroup flexDirection="column"></InputGroup>
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
            bg={!isValidRide ? "grey.100" : lightTheme.lightButton}
            mt={4}
            mb={4}
            disabled={!isValidRide}
            onClick={() => {
              if (groupId && user) {
                const userId = user.uid;
                const ride = {
                  id: "",
                  name: title,
                  start: "start",
                  end: endPosition,
                  maxPassengers: selectedCar?.numSeats || 4,
                  startDate,
                  isComplete: false,
                  pickupPoints: {
                    start: {
                      location: startPosition,
                      members: { [userId]: true },
                      geocode: "",
                    },
                  },
                  ...(isDriver && { driver: user.uid }),
                  ...(selectedCar !== undefined && {
                    carId: selectedCar?.carId,
                  }),
                };
                getReverseGeocodeAsString(startPosition)
                  .then((geo) => (ride.pickupPoints.start.geocode = geo))
                  .then(() => createRide(ride, groupId, [userId]))
                  .then(() => navigate(`/group/${groupId}`))
                  .catch((err) => console.error(err));
                console.log({ ride });
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
  position: L.LatLng;
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
      position={props.position}
      ref={markerRef}
      icon={props.icon}
    />
  );
};
