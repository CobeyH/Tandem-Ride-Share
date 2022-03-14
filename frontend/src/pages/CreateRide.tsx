import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Container,
  Heading,
  HStack,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { Steps, useSteps } from "chakra-ui-steps";
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
import LocationSearch from "../components/Rides/LocationSearch";
import VerifiedStep from "../components/VerifiedStep";
import {
  FaCarSide,
  FaClipboard,
  FaClock,
  FaMapMarkedAlt,
  GiCarWheel,
} from "react-icons/all";
import { styleColors } from "../theme/colours";

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
  const [isDriver, setIsDriver] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Vehicle | undefined>(
    undefined
  );
  const [startDate, setStartDate] = useState("");
  const { nextStep, prevStep, setStep, activeStep } = useSteps({
    initialStep: 0,
  });

  function onDragStart(position: LatLng) {
    setStartPosition(position);
    map?.invalidateSize();
    map?.fitBounds(latLngBounds([startPosition, endPosition]));
  }
  function onDragEnd(position: LatLng) {
    console.log(position);
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

  const submitRide = () => {
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
    }
  };

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
            currentInput={title}
            isVerified={(title) => title.length !== 0}
            isFirstStep={true}
            nextStep={nextStep}
            prevStep={prevStep}
            icon={FaClipboard}
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
          <VerifiedStep
            label="Are you the driver?"
            currentInput={isDriver}
            isVerified={(driver) => driver !== undefined}
            prevStep={prevStep}
            nextStep={(driver) => {
              if (driver) nextStep();
              else setStep(activeStep + 2);
            }}
            icon={GiCarWheel}
          >
            <HStack>
              <Button
                bg={!isDriver ? styleColors.green : "white"}
                onClick={() => setIsDriver(false)}
                borderRadius={20}
                borderWidth={2}
              >
                Passenger
              </Button>
              <Button
                bg={isDriver ? styleColors.green : "white"}
                onClick={() => setIsDriver(true)}
                borderRadius={20}
                borderWidth={2}
              >
                Driver
              </Button>
            </HStack>
          </VerifiedStep>
          <VerifiedStep
            label="Select Car"
            currentInput={selectedCar}
            isVerified={(car) => {
              return car !== undefined;
            }}
            nextStep={nextStep}
            prevStep={prevStep}
            icon={FaCarSide}
          >
            <ChooseCar
              carUpdate={(car) => {
                setSelectedCar(car);
              }}
            />
            {selectedCar ? (
              <CarStatsSlider
                car={selectedCar}
                updateCar={setSelectedCar}
                isDisabled={true}
              />
            ) : null}
          </VerifiedStep>
          <VerifiedStep
            label="Start Time"
            currentInput={startDate}
            prevStep={() => {
              if (isDriver) prevStep();
              else setStep(activeStep - 2);
            }}
            nextStep={nextStep}
            isVerified={(time) =>
              new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/g).test(time)
            }
            icon={FaClock}
          >
            <Input
              mb="4"
              type="datetime-local"
              onInput={(e) => setStartDate(e.currentTarget.value)}
            />
          </VerifiedStep>
          <VerifiedStep
            label="Create Route"
            currentInput={{ start: startPosition, end: endPosition }}
            prevStep={prevStep}
            nextStep={submitRide}
            isLastStep={true}
            isVerified={(position) => {
              return position.start !== position.end;
            }}
            icon={FaMapMarkedAlt}
          >
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
          </VerifiedStep>
        </Steps>
        <InputGroup flexDirection="column" />
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
