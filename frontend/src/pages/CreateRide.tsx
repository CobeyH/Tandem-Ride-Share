import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { Steps, useSteps } from "chakra-ui-steps";
import {
  Ride,
  setGroupRide,
  persistRide,
  setRidePassenger,
  setRoute,
  Vehicle,
} from "../firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import { Marker } from "react-leaflet";
import Header from "../components/Header";
import MapView, {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  endIcon,
  startIcon,
} from "../components/Rides/MapView";
import { LatLng, latLngBounds, LeafletMouseEvent } from "leaflet";
import ChooseCar from "../components/Rides/ChooseCar";
import CarStatsSlider from "../components/Profiles/CarStatsSlider";
import { getRideRoute } from "../Directions";
import LocationSearch from "../components/Rides/LocationSearch";
import VerifiedStep from "../components/VerifiedStep";
import {
  FaCalendar,
  FaCarSide,
  FaClipboard,
  FaClock,
  FaMapMarkedAlt,
  GiCarWheel,
} from "react-icons/all";
import { styleColors } from "../theme/colours";

const tutorialSteps = [
  {
    target: "#ride-create",
    content:
      "Rides are used to organize carpoolers. You can let others know when you plan to drive or ask others for a lift.",
    disableBeacon: true,
  },
  {
    target: "#ride-name",
    content:
      "The ride name should be a short description of what the ride is about. This allows others to quickly determine if they are interested in joining the ride.",
  },
  {
    target: "#ride-driver",
    content:
      "You can create a ride as either a driver or passenger. If you choose to drive you must select a car from your profile.",
  },
  {
    target: "#ride-time",
    content:
      "You must specify to time you plan the trip to start. This will be used to determine when the car will get to each pickup point.",
  },
  {
    target: "#ride-route",
    content:
      "The route dictates where the trip will start and end. You can either enter text into the search boxes to drag the markers to fine-tune your start and destination points.",
  },
  {
    target: "#ride-route",
    content:
      "If you create a ride as a passenger then the start point will be changed to the location that the driver is departing from when a driver joins.",
  },
];

const createRide = async (
  ride: Ride,
  groupId: string,
  passList: string[] = []
) => {
  const rideId = (await persistRide(ride)).id;
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

  const [startPosition, setStartPosition] = useState<LatLng>();
  const [endPosition, setEndPosition] = useState<LatLng>();
  const [map, setMap] = useState<L.Map | undefined>(undefined);
  const [isDriver, setIsDriver] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Vehicle | undefined>(
    undefined
  );
  const [startDate, setStartDate] = useState("");

  const currentTime = getCurrentTime();
  const [startTime, setStartTime] = useState(currentTime);
  const { nextStep, prevStep, setStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const [pickingMapStartLocation, setPickingMapStartLocation] = useState(false);
  const [pickingMapEndLocation, setPickingMapEndLocation] = useState(false);

  function getCurrentTime() {
    const date = new Date();
    const timeComponents = [date.getHours(), date.getMinutes()];
    return timeComponents
      .map((component) => {
        const pad = component < 10 ? "0" : "";
        return pad + component;
      })
      .join(":");
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!isDriver) {
      setSelectedCar(undefined);
    }
  }, [isDriver]);

  useEffect(() => {
    if (map) {
      map.invalidateSize();
      if (startPosition && endPosition) {
        map.fitBounds(latLngBounds([endPosition, startPosition]).pad(0.1));
      } else if (startPosition) {
        map.panTo(startPosition);
      } else if (endPosition) {
        map.panTo(endPosition);
      } else {
        map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      }
    }
  }, [map, startPosition, endPosition]);

  const submitRide = () => {
    if (groupId && user && startPosition && endPosition) {
      const userId = user.uid;
      const ride: Ride = {
        id: "",
        name: title,
        start: "start",
        end: endPosition,
        startDate: `${startDate}T${startTime}`,
        isComplete: false,
        pickupPoints: {
          start: {
            location: startPosition,
            members: { [userId]: true },
          },
        },
        ...(isDriver && { driver: user.uid }),
        ...(selectedCar !== undefined && {
          carId: selectedCar?.carId,
        }),
      };
      createRide(ride, groupId, [userId])
        .then(() => navigate(`/group/${groupId}`))
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    if (!map || !(pickingMapStartLocation || pickingMapEndLocation)) return;
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (!map || !map.getContainer()) return;
      if (event.target instanceof Element) {
        if (!map.getContainer().contains(event.target)) {
          setPickingMapStartLocation(false);
          setPickingMapEndLocation(false);
        }
      }
    }
    function handleMapClick(event: LeafletMouseEvent) {
      if (pickingMapStartLocation) {
        setStartPosition(event.latlng);
        setPickingMapStartLocation(false);
      } else if (pickingMapEndLocation) {
        setEndPosition(event.latlng);
        setPickingMapEndLocation(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    map.on("click", handleMapClick);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
      map.off("click", handleMapClick);
    };
  }, [pickingMapStartLocation, pickingMapEndLocation, map]);

  return (
    <>
      <Header tutorialSteps={tutorialSteps} />
      <Container>
        <Heading id="ride-create" textAlign={"center"}>
          Create Ride
        </Heading>
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
              id="ride-name"
              mt={4}
              value={title}
              placeholder={"Ride Name"}
              onInput={(e) => {
                setTitle(e.currentTarget.value);
              }}
            />
          </VerifiedStep>
          <VerifiedStep
            label="Select Role"
            id="ride-driver"
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
                bg={!isDriver ? styleColors.medGreen : "white"}
                onClick={() => setIsDriver(false)}
                borderRadius={20}
                borderWidth={2}
              >
                Passenger
              </Button>
              <Button
                bg={isDriver ? styleColors.medGreen : "white"}
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
            id="ride-car"
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
            label="Set Start Time"
            id="ride-time"
            currentInput={[startDate, startTime]}
            prevStep={() => {
              if (isDriver) prevStep();
              else setStep(activeStep - 2);
            }}
            nextStep={nextStep}
            isVerified={([date, time]) =>
              new RegExp(/\d{2}:\d{2}/g).test(time) &&
              new RegExp(/\d{4}-\d{2}-\d{2}/g).test(date)
            }
            icon={FaCalendar}
          >
            <InputGroup>
              <Input
                mb="4"
                type="date"
                onInput={(e) => setStartDate(e.currentTarget.value)}
              />
              <InputLeftElement>
                <FaCalendar />
              </InputLeftElement>
            </InputGroup>
            <InputGroup>
              <Input
                mb="4"
                type="time"
                onInput={(e) => setStartTime(e.currentTarget.value)}
                defaultValue={currentTime}
              />
              <InputLeftElement>
                <FaClock />
              </InputLeftElement>
            </InputGroup>
          </VerifiedStep>
          <VerifiedStep
            label="Create Route"
            id="ride-route"
            currentInput={{ start: startPosition, end: endPosition }}
            prevStep={prevStep}
            nextStep={submitRide}
            isLastStep={true}
            isVerified={(position) => {
              return position.start !== position.end;
            }}
            icon={FaMapMarkedAlt}
          >
            <Text variant="help-text" textAlign="left" pb={2}>
              Search for locations by address, or click the button to choose on
              the map.
            </Text>
            <Heading variant="sub-heading">Start Location</Heading>
            <HStack align="flex-start">
              <LocationSearch setLatLng={setStartPosition} />
              <IconButton
                icon={<FaMapMarkedAlt />}
                aria-label="Choose start location on map"
                variant={pickingMapStartLocation ? "solid" : "outline"}
                onClick={() => {
                  setPickingMapStartLocation(!pickingMapStartLocation);
                }}
              />
            </HStack>
            <Heading variant="sub-heading">End Location</Heading>
            <HStack align="flex-start">
              <LocationSearch setLatLng={setEndPosition} />
              <IconButton
                icon={<FaMapMarkedAlt />}
                aria-label="Choose end location on map"
                variant={pickingMapEndLocation ? "solid" : "outline"}
                onClick={() => {
                  setPickingMapEndLocation(!pickingMapEndLocation);
                }}
              />
            </HStack>
            <MapView style={{ height: "50vh" }} setMap={setMap}>
              {startPosition ? (
                <Marker position={startPosition} icon={startIcon} />
              ) : null}
              {endPosition ? (
                <Marker position={endPosition} icon={endIcon} />
              ) : null}
              {/*
                <DraggableMarker
                  position={startPosition}
                  onDragEnd={(p: LatLng) => {
                    setEndPosition(p);
                  }}
                  icon={startIcon}
                />
                <DraggableMarker
                  position={endPosition}
                  onDragEnd={(p: LatLng) => {
                    setStartPosition(p);
                  }}
                  icon={endIcon}
                />
               */}
            </MapView>
          </VerifiedStep>
        </Steps>
        <InputGroup flexDirection="column" />
      </Container>
    </>
  );
};

export default CreateRide;
