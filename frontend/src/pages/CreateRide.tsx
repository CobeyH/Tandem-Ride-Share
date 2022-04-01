import React, { useEffect, useState } from "react";
import {
  Box,
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
} from "../components/Rides/MapView";
import { divIcon, LatLng, latLngBounds, LeafletMouseEvent } from "leaflet";
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
import ReactDOMServer from "react-dom/server";

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
        <Heading id="ride-create" textAlign={"center"} mt={5}>
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
            <HStack mt={1} mb={3}>
              <Box flexGrow={1}>
                <LocationSearch setLatLng={setStartPosition} />
              </Box>
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
            <HStack mt={1} mb={3}>
              <Box flexGrow={1}>
                <LocationSearch setLatLng={setEndPosition} />
              </Box>
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
                <Marker
                  position={startPosition}
                  icon={MarkerIcon(
                    isDriver ? MarkerPurpose.Start : MarkerPurpose.Pickup
                  )}
                />
              ) : null}
              {endPosition ? (
                <Marker
                  position={endPosition}
                  icon={MarkerIcon(MarkerPurpose.End)}
                />
              ) : null}
            </MapView>
          </VerifiedStep>
        </Steps>
        <InputGroup flexDirection="column" />
      </Container>
    </>
  );
};

export default CreateRide;

enum MarkerPurpose {
  Start,
  Pickup,
  End,
}

const SVGMarkerIcon = ({ purpose }: { purpose: MarkerPurpose }) => (
  <svg
    width="40"
    height="48"
    viewBox="0 0 40 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="20"
      cy="20"
      r="19"
      fill="white"
      stroke="black"
      strokeWidth="2"
    />
    <path
      d="M28.4829 34L20 46.2441L11.5171 34H28.4829Z"
      fill="#EBEBEB"
      stroke="black"
      strokeWidth="2"
    />
    <circle cx="20" cy="20" r="18" fill="#EBEBEB" />
    {purpose === MarkerPurpose.Pickup ? (
      <>
        <path
          d="M9.5625 27.875C9.5625 27.875 8 27.875 8 26.3125C8 24.75 9.5625 20.0625 17.375 20.0625C25.1875 20.0625 26.75 24.75 26.75 26.3125C26.75 27.875 25.1875 27.875 25.1875 27.875H9.5625ZM17.375 18.5C18.6182 18.5 19.8105 18.0061 20.6896 17.1271C21.5686 16.248 22.0625 15.0557 22.0625 13.8125C22.0625 12.5693 21.5686 11.377 20.6896 10.4979C19.8105 9.61886 18.6182 9.125 17.375 9.125C16.1318 9.125 14.9395 9.61886 14.0604 10.4979C13.1814 11.377 12.6875 12.5693 12.6875 13.8125C12.6875 15.0557 13.1814 16.248 14.0604 17.1271C14.9395 18.0061 16.1318 18.5 17.375 18.5Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29.0938 13.8125C29.301 13.8125 29.4997 13.8948 29.6462 14.0413C29.7927 14.1878 29.875 14.3865 29.875 14.5938V16.9375H32.2188C32.426 16.9375 32.6247 17.0198 32.7712 17.1663C32.9177 17.3128 33 17.5115 33 17.7188C33 17.926 32.9177 18.1247 32.7712 18.2712C32.6247 18.4177 32.426 18.5 32.2188 18.5H29.875V20.8438C29.875 21.051 29.7927 21.2497 29.6462 21.3962C29.4997 21.5427 29.301 21.625 29.0938 21.625C28.8865 21.625 28.6878 21.5427 28.5413 21.3962C28.3948 21.2497 28.3125 21.051 28.3125 20.8438V18.5H25.9688C25.7615 18.5 25.5628 18.4177 25.4163 18.2712C25.2698 18.1247 25.1875 17.926 25.1875 17.7188C25.1875 17.5115 25.2698 17.3128 25.4163 17.1663C25.5628 17.0198 25.7615 16.9375 25.9688 16.9375H28.3125V14.5938C28.3125 14.3865 28.3948 14.1878 28.5413 14.0413C28.6878 13.8948 28.8865 13.8125 29.0938 13.8125Z"
          fill="black"
        />
      </>
    ) : null}
    {purpose === MarkerPurpose.Start ? (
      <path
        d="M9.85672 16.225L11.5063 11.5136C12.1377 9.70844 13.8406 8.5 15.7531 8.5H24.2469C26.1594 8.5 27.8609 9.70844 28.4938 11.5136L30.1437 16.225C31.2312 16.675 32 17.7484 32 19V28C32 28.8297 31.3297 29.5 30.5 29.5H29C28.1703 29.5 27.5 28.8297 27.5 28V25.75H12.5V28C12.5 28.8297 11.8283 29.5 11 29.5H9.5C8.67172 29.5 8 28.8297 8 28V19C8 17.7484 8.76688 16.675 9.85672 16.225ZM13.1141 16H26.8859L25.6625 12.5031C25.4516 11.9031 24.8844 11.5 24.2469 11.5H15.7531C15.1156 11.5 14.5484 11.9031 14.3375 12.5031L13.1141 16ZM12.5 19C11.6717 19 11 19.6703 11 20.5C11 21.3297 11.6717 22 12.5 22C13.3297 22 14 21.3297 14 20.5C14 19.6703 13.3297 19 12.5 19ZM27.5 22C28.3297 22 29 21.3297 29 20.5C29 19.6703 28.3297 19 27.5 19C26.6703 19 26 19.6703 26 20.5C26 21.3297 26.6703 22 27.5 22Z"
        fill="black"
      />
    ) : null}
    {purpose === MarkerPurpose.End ? (
      <g clipPath="url(#clip0_0_1)">
        <path
          d="M29.2291 9.00097C28.9731 9.00097 28.7071 9.05698 28.4525 9.1771C26.6146 10.0463 25.2521 10.3413 24.115 10.3413C21.7029 10.3413 20.3012 9.01377 17.5233 9.01335C16.125 9.01335 14.3875 9.34683 12 10.3492V10.3333C12 9.59375 11.4062 9 10.6667 9C9.92708 9 9.33333 9.59375 9.33333 10.3333L9.33167 29.6667C9.33167 30.0312 9.63375 30.3333 9.99833 30.3333H11.3333C11.6979 30.3333 12 30.0333 12 29.6667V25C14.1558 24.0058 15.8629 23.6742 17.3458 23.6742C20.3079 23.6742 22.3708 24.9983 25.3333 24.9983C26.6171 24.9983 28.0696 24.7496 29.8375 24.0363C30.3458 23.8292 30.6666 23.35 30.6666 22.8375V10.2808C30.6666 9.50042 29.9916 9.00097 29.2291 9.00097ZM28 14.9083C26.6671 15.4933 25.5912 15.7663 24.6667 15.8454V19.1875C25.7267 19.126 26.8162 18.8978 28 18.465V21.8708C27.0487 22.1809 26.1696 22.3325 25.3321 22.3325C25.1051 22.3325 24.8858 22.3148 24.6667 22.2954V19.1875C24.4818 19.1982 24.2961 19.2147 24.1129 19.2147C23.0371 19.2147 22.14 19.0252 21.3333 18.7947V21.5826C20.3412 21.3303 19.2429 21.1072 18 21.0418V17.8792C17.8417 17.9042 17.6875 17.8875 17.5208 17.8875C16.7 17.8875 15.7125 18.0708 14.6667 18.3792V21.2583C13.8 21.475 12.9125 21.7417 12 22.1V19.4458L13.0321 19.0129C13.6167 18.7708 14.15 18.5792 14.6667 18.3792V14.975C13.8708 15.1875 13.0042 15.4667 12 15.8875V13.2417L13.0321 12.8088C13.6167 12.5633 14.15 12.3737 14.6667 12.2092V14.9762C15.7662 14.6865 16.7121 14.5525 17.52 14.5529C17.6897 14.5529 17.8398 14.5715 18 14.5808V11.7096C18.775 11.775 19.4333 11.9813 20.2167 12.2429C20.5708 12.3596 20.9458 12.4771 21.3333 12.5883V15.3413C22.1996 15.6263 23.0604 15.8812 24.1129 15.8812C24.2882 15.8812 24.4788 15.8614 24.6667 15.8454V12.9808C25.7267 12.9193 26.8162 12.6911 28 12.2583V14.9083ZM18 14.5792V17.9142C18.7754 17.9796 19.4321 18.186 20.2179 18.4475C20.5708 18.5667 20.9458 18.6833 21.3333 18.7958V15.3417C20.3375 15.0125 19.3167 14.6583 18 14.5792Z"
          fill="black"
        />
      </g>
    ) : null}
    <defs>
      <clipPath id="clip0_0_1">
        <rect
          width="24"
          height="21.3333"
          fill="white"
          transform="translate(8 9)"
        />
      </clipPath>
    </defs>
  </svg>
);

const MarkerIcon = (purpose: MarkerPurpose) =>
  divIcon({
    className: "",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    html: ReactDOMServer.renderToString(<SVGMarkerIcon purpose={purpose} />),
  });
