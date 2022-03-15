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
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { BsFillPersonFill, BsGeoAlt } from "react-icons/bs";
import { AiFillCar } from "react-icons/ai";
import MapView, { endIcon, findMidpoint } from "./MapView";
import { Marker, Polyline } from "react-leaflet";
import { latLng, LatLng, latLngBounds, LeafletMouseEvent, Map } from "leaflet";
import { auth } from "../../firebase/firebase";
import {
  addPickupToRide,
  clearUserFromPickups,
  completeRide,
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
import PickupMarkers from "./PickupMarkers";
import { getOptimizedRoute, getReverseGeocodeAsString } from "../../Directions";
import LocationSearch from "./LocationSearch";

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

  let center, endMarker, startLocation: LatLng;
  if (ride !== undefined) {
    startLocation = ride.pickupPoints[ride.start].location as LatLng;
    center = findMidpoint(startLocation, ride.end as LatLng);
    endMarker = <Marker position={ride.end} icon={endIcon} />;
  }

  return !ride?.isComplete == isActive ? (
    <Box borderWidth="1px" borderRadius="lg" p="3">
      {rideLoading && "Loading..."}
      {rideError && `Error: ${rideError.message}`}
      {ride && (
        <>
          {/** Header and Collapse Button */}
          <Flex onClick={onToggle}>
            <Heading size="sm" isTruncated>
              {ride.name}
            </Heading>
            <Spacer />
            {isOpen ? (
              <ChevronUpIcon w={6} h={6} />
            ) : (
              <Flex flexDirection="row" gap={2} justify="flex-end">
                <DriverIcon isDriver={ride.driver !== undefined} />
                <PassengerCounter rideId={rideId} />
                <ChevronDownIcon w={6} h={6} />
              </Flex>
            )}
          </Flex>
          {/** Collapse Body */}
          <Collapse
            in={isOpen}
            onAnimationComplete={() => {
              if (map && isOpen) {
                map.invalidateSize();
                map.fitBounds(
                  latLngBounds([
                    latLng(ride.end.lat, ride.end.lng),
                    startLocation,
                  ]).pad(0.1)
                );
              }
            }}
          >
            <DriverBar
              rideId={rideId}
              driverId={ride.driver}
              amPassenger={Boolean(userPassenger)}
            />
            <PassengerBar rideId={rideId} />
            {ride.startDate ? (
              <RideTimesBar startTime={ride.startDate} />
            ) : null}
            {
              /** Pickup Bar */
              userPassenger && map ? (
                <PickupBar rideId={rideId} map={map} />
              ) : null
            }
            {/** Map */}
            <AspectRatio ratio={16 / 10} mt="2">
              <MapView center={center} zoom={undefined} setMap={setMap}>
                {endMarker}
                <PickupMarkers pickups={ride?.pickupPoints} rideId={rideId} />
                {route && <Polyline positions={route.shape} />}
              </MapView>
            </AspectRatio>
            <GasCalculator
              fuelUsage={car?.fuelUsage}
              distance={route?.distance}
              rideId={rideId}
            />
            {
              /** Join / Complete Bar */
              user ? (
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

function DriverIcon({ isDriver }: { isDriver: boolean }) {
  return (
    <Icon
      as={AiFillCar}
      w={6}
      h={6}
      color={isDriver ? "green.100" : "red.200"}
    />
  );
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
}: {
  rideId: string;
  driverId?: string;
  amPassenger: boolean;
}) {
  const [authUser] = useAuthState(auth);
  const [user] = useUser(authUser?.uid);
  const [ride] = useRide(rideId);
  const [driverChecked, setDriverChecked] = useState<boolean | undefined>(
    authUser?.uid === driverId
  );
  const [driverUser, driverLoading, driverError] = useUser(driverId);
  const driver = driverLoading
    ? "Loading"
    : driverError
    ? "Error"
    : driverUser?.name;

  useEffect(() => {
    if (driverChecked !== undefined && user?.vehicles) {
      setRideDriver(
        user.uid,
        rideId,
        Object.keys(user.vehicles).pop(),
        driverChecked
      );
    }
  }, [driverChecked]);

  useEffect(() => {
    setDriverChecked(authUser?.uid === driverId);
  }, [amPassenger, driverId, authUser]);

  return (
    <>
      <RideCardBar>
        <DriverIcon isDriver={driverId !== undefined} />
        <Text>{`${driverId ? driver : "Driver Needed"}`}</Text>
        <Spacer />
        {amPassenger && (driverUser?.uid === user?.uid || !driverUser) ? (
          <Switch
            id="am-driver"
            isChecked={driverChecked}
            onChange={() => setDriverChecked(!driverChecked)}
          />
        ) : null}
      </RideCardBar>
      {authUser?.uid === driverId ? (
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
  const [text, setText] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const [addingPickup, setAddingPickup] = useState(false);

  useEffect(() => {
    if (ride && user) {
      const p = Object.values(ride.pickupPoints).find((p) => {
        if (!p.members) return false;
        return Object.keys(p.members).includes(user.uid);
      });
      setText(p?.geocode);
    }
  }, [user, ride]);

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
    await getReverseGeocodeAsString(latLng(position.lat, position.lng)).then(
      (geocode) => {
        newPoint.geocode = geocode;
      }
    );
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
      .then((ride) => {
        // Fetch optimized route for new points
        const routePoints = [latLng(ride.pickupPoints[ride.start].location)];
        Object.keys(ride.pickupPoints).map((k) => {
          if (k === ride.start) return;
          routePoints.push(latLng(ride.pickupPoints[k].location));
        });
        routePoints.push(latLng(ride.end));
        return getOptimizedRoute(routePoints);
      })
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

function RideTimesBar({ startTime }: { startTime: string }) {
  // make time strings pretty
  const start_date = startTime?.split("T")[0];
  let start_time = startTime?.split("T")[1];
  const isPm_start = parseInt(start_time.split(":")[0]) >= 12;

  start_time = isPm_start
    ? `${parseInt(start_time.split(":")[0]) - 12}:${start_time.split(":")[1]}`
    : `${parseInt(start_time.split(":")[0])}:${start_time.split(":")[1]}`;

  return (
    <>
      <RideCardBar>
        <Text>Start Date</Text>
        <Spacer />
        <Text>
          {start_date} {start_time} {isPm_start ? "PM" : "AM"}
        </Text>
      </RideCardBar>
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

function CompleteRideButton({ rideId }: { rideId: string }) {
  return (
    <Button
      width="full"
      onClick={() => {
        confirm("Do you want to mark this ride as complete?")
          ? completeRide(rideId)
          : null;
      }}
    >
      Complete Ride
    </Button>
  );
}
