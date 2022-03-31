import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  HStack,
  Icon,
  Spacer,
  Spinner,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { BsFillPersonFill, BsGeoAlt } from "react-icons/bs";
import { AiFillCar } from "react-icons/ai";
import MapView from "./MapView";
import { Polyline } from "react-leaflet";
import { latLng, LatLng, latLngBounds, LeafletMouseEvent, Map } from "leaflet";
import { auth } from "../../firebase/firebase";
import {
  addPickupToRide,
  clearUserFromPickups,
  getRide,
  PickupPoint,
  setRideDriver,
  setRidePassenger,
  setRoute,
  setUserInPickup,
  useRide,
  useRidePassenger,
  useRidePassengers,
  useRoute,
  useUser,
  useUserVehicle,
} from "../../firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import ChooseCar from "./ChooseCar";
import GasCalculator from "./GasCalculator";
import RideMarkers from "./PickupMarkers";
import { getOptimizedRoute } from "../../Directions";
import LocationSearch from "./LocationSearch";
import CompleteRideButton from "./CompleteRideButton";

export default function RideCard({
  rideId,
  isActive,
}: {
  rideId: string;
  viewOnly?: boolean;
  isActive?: boolean;
}) {
  const [user] = useAuthState(auth);
  const [ride, rideLoading, rideError] = useRide(rideId);
  const [userPassenger] = useRidePassenger(rideId, user?.uid);
  const [route] = useRoute(rideId);
  const { isOpen, onToggle } = useDisclosure();
  const [map, setMap] = useState<Map | undefined>(undefined);
  const [car] = useUserVehicle(ride?.driver, ride?.carId);

  const cardColour = useColorModeValue(
    isActive ? "white" : "gray.100",
    isActive ? "gray.700" : "gray.600"
  );
  return !ride?.isComplete == isActive ? (
    <Box borderWidth="1px" w="100%" borderRadius="lg" p="3" bg={cardColour}>
      {rideLoading && "Loading..."}
      {rideError && `Error: ${rideError.message}`}
      {ride && (
        <>
          {/** Header and Collapse Button */}
          <Flex onClick={onToggle}>
            <Heading id={`${rideId}-name`} size="sm" isTruncated>
              {ride.name}
            </Heading>
            <Spacer />
            {isOpen ? (
              <ChevronUpIcon w={6} h={6} />
            ) : (
              <Flex flexDirection="row" gap={2} justify="flex-end">
                <DriverIcon
                  isDriver={ride.driver !== undefined}
                  isActive={isActive}
                />
                <PassengerCounter rideId={rideId} />
                <ChevronDownIcon w={6} h={6} />
              </Flex>
            )}
          </Flex>
          {/** Collapse Body */}
          <Collapse
            in={isOpen}
            onAnimationComplete={() => {
              if (map && ride && route && isOpen) {
                map.invalidateSize();
                const box = route?.boundingBox
                  ? [
                      latLng(
                        route.boundingBox.ul.lat,
                        route.boundingBox.ul.lng
                      ),
                      latLng(
                        route.boundingBox.lr.lat,
                        route.boundingBox.lr.lng
                      ),
                    ]
                  : [
                      latLng(ride.end.lat, ride.end.lng),
                      ...Object.values(ride.pickupPoints ?? {}).map((p) => {
                        return latLng(p.location.lat, p.location.lng);
                      }),
                    ];
                map.fitBounds(latLngBounds(box).pad(0.1));
              }
            }}
          >
            <DriverBar
              rideId={rideId}
              driverId={ride.driver}
              amPassenger={Boolean(userPassenger)}
              isActive={isActive}
            />
            <PassengerBar rideId={rideId} />
            {ride.startDate ? (
              <RideTimesBar
                startTime={ride.startDate}
                duration={route?.points?.end?.duration}
              />
            ) : null}
            {
              /** Pickup Bar */
              userPassenger && map && isActive ? (
                <PickupBar rideId={rideId} map={map} />
              ) : null
            }
            {/** Map */}
            <AspectRatio ratio={16 / 10} mt="2">
              <MapView setMap={setMap}>
                <RideMarkers rideId={rideId} />
                {route && <Polyline positions={route.shape} />}
              </MapView>
            </AspectRatio>
            <GasCalculator
              fuelUsage={car?.fuelUsage}
              distance={route?.points?.end?.distance}
              rideId={rideId}
            />
            {
              /** Join / Complete Bar */
              user && isActive ? (
                <StatusButtonBar
                  rideId={rideId}
                  userId={user.uid}
                  amPassenger={Boolean(userPassenger)}
                />
              ) : null
            }
          </Collapse>
        </>
      )}
    </Box>
  ) : null;
}

/** Microcomponents */

function DriverIcon({
  isDriver,
  isActive,
}: {
  isDriver: boolean;
  isActive: boolean;
}) {
  let color;
  if (!isActive) {
    color = useColorModeValue("gray", "gray.100");
  } else {
    if (isDriver) {
      color = "green.100";
    } else {
      color = "red.200";
    }
  }
  return <Icon as={AiFillCar} w={6} h={6} color={color} />;
}

function PassengerCounter({ rideId }: { rideId: string }) {
  const [ride, rideLoading, rideError] = useRide(rideId);
  const [passVals, passLoading, passError] = useRidePassengers(rideId);
  const [car] = useUserVehicle(ride?.driver, ride?.carId);

  return (
    <>
      <Icon as={BsFillPersonFill} w={6} h={6} />
      {rideLoading || rideError !== undefined ? null : (
        <Text isTruncated>
          {`${passLoading ? "?" : passError ? "0" : passVals?.length} / ${
            car ? car.numSeats : 4
          }`}
        </Text>
      )}
    </>
  );
}

/** Bar Width Components */

function RideCardBar({ children }: { children?: ReactNode }) {
  return (
    <Flex flexDirection="row" m={2} gap={2} minH="2.5rem" align="center">
      {children}
    </Flex>
  );
}

function DriverBar({
  rideId,
  driverId,
  amPassenger,
  isActive,
}: {
  rideId: string;
  driverId?: string;
  amPassenger: boolean;
  isActive: boolean;
}) {
  const [authUser] = useAuthState(auth);
  const [user] = useUser(authUser?.uid);
  const [ride] = useRide(rideId);
  const [driverChecked, setDriverChecked] = useState<boolean | undefined>(
    undefined
  );
  const [driverUser, driverLoading, driverError] = useUser(driverId);
  const driver = driverLoading
    ? "Loading"
    : driverError
    ? "Error"
    : driverUser?.name;

  useEffect(() => {
    if (driverChecked !== undefined && user?.vehicles) {
      const amDriver = authUser?.uid === driverId;
      if ((driverChecked && !amDriver) || (!driverChecked && amDriver)) {
        setRideDriver(
          user.uid,
          rideId,
          Object.keys(user.vehicles).pop(),
          driverChecked
        );
      }
    }
  }, [driverChecked, user?.vehicles]);

  useEffect(() => {
    setDriverChecked(authUser?.uid === driverId);
  }, [amPassenger, driverId, authUser]);

  return (
    <>
      <RideCardBar>
        <DriverIcon isDriver={driverId !== undefined} isActive={isActive} />
        <Text>{`${driverId ? driver : "Driver Needed"}`}</Text>
        <Spacer />
        {amPassenger &&
        (driverUser?.uid === user?.uid || !driverUser) &&
        isActive ? (
          <Switch
            id="am-driver"
            isChecked={driverChecked}
            onChange={() => setDriverChecked(!driverChecked)}
          />
        ) : null}
      </RideCardBar>
      {driverChecked && isActive ? (
        <RideCardBar>
          <Text>Vehicle: </Text>
          <ChooseCar
            carUpdate={(v) => {
              setRideDriver(driverId, rideId, v?.carId);
            }}
            carId={ride?.carId}
          />
        </RideCardBar>
      ) : null}
    </>
  );
}

function PassengerBar({ rideId }: { rideId: string }) {
  return (
    <RideCardBar>
      <PassengerCounter rideId={rideId} />
    </RideCardBar>
  );
}

function PickupBar({ rideId, map }: { rideId: string; map: Map }) {
  const [user] = useAuthState(auth);
  const [ride, rideLoading, rideError] = useRide(rideId);
  const [route] = useRoute(rideId);
  const [text, setText] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const [addingPickup, setAddingPickup] = useState(false);

  useEffect(() => {
    if (ride && route && user) {
      const p = Object.keys(ride.pickupPoints ?? {}).find((p) => {
        const pickup = ride.pickupPoints[p];
        return Object.keys(pickup.members ?? {}).includes(user.uid);
      });
      if (p) setText(route.points[p]?.geocode ?? "");
    }
  }, [user, ride, route]);

  useEffect(() => {
    if (!addingPickup) return;
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (!ref.current || !map.getContainer()) return;
      if (event.target instanceof Element) {
        if (
          !ref.current.contains(event.target) &&
          !map.getContainer().contains(event.target)
        ) {
          setAddingPickup(false);
        }
      }
    }
    function handleMapClick(event: LeafletMouseEvent) {
      if (user) newPickupPoint(user.uid, rideId, event.latlng);
      setAddingPickup(false);
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    map.on("click", handleMapClick);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
      map.off("click", handleMapClick);
    };
  }, [addingPickup, ref, map]);

  async function newPickupPoint(
    userId: string,
    rideId: string,
    position: LatLng
  ) {
    const newPoint: PickupPoint = {
      members: {},
      location: {
        lat: position.lat,
        lng: position.lng,
      },
    };
    newPoint.members[userId] = true;
    addPickupToRide(rideId, newPoint)
      .then((ref) => {
        if (ref.key) {
          const k = ref.key;
          clearUserFromPickups(rideId, userId).then(() =>
            setUserInPickup(rideId, k, userId)
          );
        }
      })
      .then(() => getRide(rideId))
      .then(getOptimizedRoute)
      .then((route) => {
        setRoute(rideId, route);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div ref={ref}>
      <RideCardBar>
        {rideLoading ? (
          <Spinner />
        ) : rideError ? (
          <Heading>{rideError}</Heading>
        ) : (
          <>
            {user ? (
              <Stack
                direction={{ base: "column", md: "row" }}
                flexGrow={1}
                alignItems={{ base: "stretch", md: "baseline" }}
              >
                <HStack
                  flexGrow={1}
                  minH={"3.5rem"}
                  alignItems={"stretch"}
                  alignContent={"center"}
                >
                  <Icon as={BsGeoAlt} w={6} h={6} />
                  {addingPickup ? (
                    <LocationSearch
                      setLatLng={(latLng) =>
                        newPickupPoint(user?.uid, rideId, latLng)
                      }
                    />
                  ) : (
                    <>
                      <Text isTruncated>{text}</Text>
                      <Spacer />
                    </>
                  )}
                </HStack>
                <Button
                  onClick={() => {
                    setAddingPickup(!addingPickup);
                  }}
                >
                  {addingPickup ? "Cancel" : "Add New Pickup"}
                </Button>
              </Stack>
            ) : null}
          </>
        )}
      </RideCardBar>
    </div>
  );
}

function RideTimesBar({
  startTime,
  duration,
}: {
  startTime: string;
  duration?: number;
}) {
  // convert datetime string to Date object
  const startDate = new Date(startTime);

  // calculate arrival time
  const arrivalDate = new Date(startTime);
  if (duration) arrivalDate.setTime(arrivalDate.getTime() + duration * 1000);

  // date formatting options
  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  const datesAreOnSameDay = (first: Date, second: Date) => {
    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  };

  return (
    <>
      <RideCardBar>
        <Text>Start Date</Text>
        <Spacer />
        <Text>
          {startDate.toLocaleString("en-CA", { ...dateOpts, ...timeOpts })}
        </Text>
      </RideCardBar>
      {duration ? (
        <RideCardBar>
          <Text>Estimated Arrival</Text>
          <Spacer />
          <Text>
            {arrivalDate.toLocaleString(
              "en-CA",
              datesAreOnSameDay(startDate, arrivalDate)
                ? { ...timeOpts }
                : { ...timeOpts, ...dateOpts }
            )}
          </Text>
        </RideCardBar>
      ) : null}
    </>
  );
}

function StatusButtonBar({
  rideId,
  userId,
  amPassenger,
}: {
  rideId: string;
  userId: string;
  amPassenger: boolean;
}) {
  const [ride] = useRide(rideId);
  const [amDriver, setAmDriver] = useState(false);

  useEffect(() => {
    if (ride) setAmDriver(ride.driver === userId);
  }, [ride]);

  return (
    <RideCardBar>
      <Button
        width="full"
        disabled={!ride}
        onClick={() => {
          if (amPassenger) clearUserFromPickups(rideId, userId);
          if (amDriver) setRideDriver(userId, rideId, undefined, false);
          if (ride) setUserInPickup(rideId, ride?.start, userId);
          setRidePassenger(userId, rideId, !amPassenger);
        }}
      >
        {amPassenger ? "Leave this Ride" : "Join this Ride"}
      </Button>
      {amDriver ? <CompleteRideButton rideId={rideId} /> : null}
    </RideCardBar>
  );
}
