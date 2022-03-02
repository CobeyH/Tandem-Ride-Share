import React, { useEffect, useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Icon,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { BsFillPersonFill } from "react-icons/bs";
import { AiFillCar } from "react-icons/ai";
import { Ride } from "../pages/CreateRide";
import MapView, { endIcon, findMidpoint, startIcon } from "./MapView";
import { Marker, Polyline } from "react-leaflet";
import { latLng, LatLng, latLngBounds } from "leaflet";
import { useList, useObjectVal } from "react-firebase-hooks/database";
import {
  auth,
  db,
  DB_PASSENGERS_COLLECT,
  DB_RIDE_COLLECT,
  DB_USER_COLLECT,
  User,
} from "../firebase";
import { equalTo, orderByValue, query, ref, set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";

export default function RideCard({
  rideId,
  viewOnly,
}: {
  rideId: string;
  viewOnly?: boolean;
}) {
  const [user] = useAuthState(auth);
  const [ride, rideLoading, rideError] = useObjectVal<Ride>(
    ref(db, `${DB_RIDE_COLLECT}/${rideId}`)
  );
  const { isOpen, onToggle } = useDisclosure();
  const [map, setMap] = useState<L.Map | undefined>(undefined);

  let center, startMarker, endMarker;
  if (ride !== undefined) {
    center = findMidpoint(ride.start as LatLng, ride.end as LatLng);
    startMarker = <Marker position={ride.start} icon={startIcon} />;
    endMarker = <Marker position={ride.end} icon={endIcon} />;
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p="3">
      {rideLoading && "Loading..."}
      {rideError && `Error: ${rideError.message}`}
      {ride && (
        <>
          <Flex onClick={onToggle}>
            <Heading size="sm">{ride.name}</Heading>
            <Spacer />
            {isOpen ? (
              <ChevronUpIcon w={6} h={6} />
            ) : (
              <>
                <DriverDisplay
                  driverId={ride.driver}
                  displayDriverName={isOpen}
                />
                <PassengerCounter
                  rideId={ride.id}
                  maxPass={ride.maxPassengers}
                />
                <ChevronDownIcon w={6} h={6} />
              </>
            )}
          </Flex>
          <Collapse
            in={isOpen}
            onAnimationComplete={() => {
              if (map && isOpen) {
                map.invalidateSize();
                map.fitBounds(
                  latLngBounds([
                    latLng(ride.end.lat, ride.end.lng),
                    latLng(ride.start.lat, ride.start.lng),
                  ]).pad(0.1)
                );
              }
            }}
          >
            <Flex flexDirection="row" m={2} align="center">
              <DriverDisplay
                driverId={ride.driver}
                displayDriverName={isOpen}
              />
              <Spacer />
              {user && !viewOnly ? (
                <DriverButton rideId={rideId} userId={user.uid} />
              ) : (
                ""
              )}
            </Flex>
            <Flex flexDirection="row" m={2} align="center">
              <PassengerCounter rideId={ride.id} maxPass={ride.maxPassengers} />
              <Spacer />
              {user && !viewOnly ? (
                <PassengerButton rideId={ride.id} userId={user.uid} />
              ) : (
                ""
              )}
            </Flex>
            <AspectRatio ratio={16 / 10} mt="2">
              <MapView center={center} zoom={undefined} setMap={setMap}>
                {startMarker}
                {endMarker}
                <RidePath
                  start={ride?.start as LatLng}
                  end={ride?.end as LatLng}
                />
              </MapView>
            </AspectRatio>
          </Collapse>
        </>
      )}
    </Box>
  );
}

function setRidePassenger(passId: string, rideId: string, state: boolean) {
  set(ref(db, `${DB_PASSENGERS_COLLECT}/${rideId}/${passId}`), state);
}

function setRideDriver(driverId: string, rideId: string, state: boolean) {
  set(ref(db, `${DB_RIDE_COLLECT}/${rideId}/driver`), state ? driverId : null);
}

function PassengerButton({
  rideId,
  userId,
}: {
  rideId: string;
  userId: string;
}) {
  const [amPassenger, loading, error] = useObjectVal(
    ref(db, `${DB_PASSENGERS_COLLECT}/${rideId}/${userId}`)
  );
  return (
    <Button
      disabled={loading || error !== undefined}
      onClick={() => {
        setRidePassenger(userId, rideId, !amPassenger);
      }}
    >
      {amPassenger ? "Leave" : "Join"}
    </Button>
  );
}

function PassengerCounter({
  rideId,
  maxPass,
}: {
  rideId: string;
  maxPass: number;
}) {
  const [passVals, passLoading, passError] = useList(
    query(
      ref(db, `${DB_PASSENGERS_COLLECT}/${rideId}`),
      orderByValue(),
      equalTo(true)
    )
  );

  return (
    <>
      <Icon as={BsFillPersonFill} w={6} h={6} />
      <Text ms={1} me={3}>
        {`${
          passLoading ? "?" : passError ? "0" : passVals?.length
        } / ${maxPass}`}
      </Text>
    </>
  );
}

function DriverButton({ rideId, userId }: { rideId: string; userId: string }) {
  const [driver, loading, error] = useObjectVal<string>(
    ref(db, `${DB_RIDE_COLLECT}/${rideId}/driver`)
  );
  const amDriver = driver === userId;
  return !loading && error === undefined ? (
    <Button
      onClick={() => {
        setRideDriver(userId, rideId, !amDriver);
      }}
    >
      {amDriver ? "Leave" : "Join"}
    </Button>
  ) : (
    <></>
  );
}

function DriverDisplay({
  driverId,
  displayDriverName,
}: {
  driverId: string | undefined;
  displayDriverName: boolean;
}) {
  const [driverUser, driverLoading, driverError] = useObjectVal<User>(
    ref(db, `${DB_USER_COLLECT}/${driverId}`)
  );
  const driver = driverLoading
    ? "Loading"
    : driverError
    ? "Error"
    : driverUser?.name;

  return (
    <>
      <Icon
        as={AiFillCar}
        w={6}
        h={6}
        color={driverId ? "green.100" : "red.200"}
      />
      {displayDriverName ? (
        <Text ms={1} me={3}>{`${driverId ? driver : "Driver Needed"}`}</Text>
      ) : null}
    </>
  );
}

function RidePath({ start, end }: { start: LatLng; end: LatLng }) {
  const [error, setError] = useState(null);
  const [routeLoaded, setRouteLoaded] = useState(false);
  const [pathLoaded, setPathLoaded] = useState(false);
  const [route, setRoute] = useState([]);
  const [path, setPath] = useState<LatLng[] | undefined>(undefined);

  useEffect(() => {
    fetch(
      `${MQ_DIR_URI}?key=${MQ_KEY}` +
        `&from=${start.lat},${start.lng}&to=${end.lat},${end.lng}&unit=k`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setRouteLoaded(true);
          setRoute(result);
          fetch(
            `${MQ_DIR_URI}shape?key=${MQ_KEY}` +
              `&sessionId=${result.route.sessionId}&fullShape=true`
          )
            .then((res) => res.json())
            .then(
              (result) => {
                setPathLoaded(true);
                setPath(arrayToLatLngs(result.route.shape.shapePoints));
              },
              (error) => {
                setPathLoaded(true);
                setError(error);
              }
            );
        },
        (error) => {
          setRouteLoaded(true);
          setError(error);
        }
      );
  }, []);

  return (
    <>
      {!error && routeLoaded && pathLoaded && path ? (
        <Polyline positions={path} />
      ) : (
        "Loading..."
      )}
    </>
  );
}

const MQ_DIR_URI = "http://open.mapquestapi.com/directions/v2/route";
const MQ_KEY = "zrK0kZ2o9WcxfTJpYYWaZ9uYHYSZvcyC";

/**
 * MapQuest Directions RouteShape API returns flat array of decimal lat and lng.
 * @param array Array of numbers [ lat0, lng0, lat1, lng1, ... ]
 * @returns Array of LatLng [ LatLng0, LatLng1, ... ]
 */
function arrayToLatLngs(array: Array<number>) {
  const result = [];
  for (let i = 0; i < array.length; i += 2) {
    result.push(latLng(array[i], array[i + 1]));
  }
  return result;
}
