import React, { useState } from "react";
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
import { Marker } from "react-leaflet";
import { LatLng } from "leaflet";
import {
  useList,
  useListVals,
  useObjectVal,
} from "react-firebase-hooks/database";
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
    <Box borderWidth="1px" borderRadius="lg" p="3" minW="sm">
      {rideLoading && "Loading..."}
      {rideError && `Error: ${rideError.message}`}
      {ride && (
        <>
          <Flex onClick={onToggle}>
            <Heading size="md">{ride.name}</Heading>
            <Spacer />
            {isOpen ? (
              <ChevronUpIcon w={6} h={6} />
            ) : (
              <>
                <DriverDisplay driverId={ride.driver} />
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
              if (map && isOpen) map.invalidateSize();
            }}
          >
            <Flex flexDirection="row" m={2} align="center">
              <DriverDisplay driverId={ride.driver} />
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

function DriverDisplay({ driverId }: { driverId: string | undefined }) {
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
      <Icon as={AiFillCar} w={6} h={6} />
      <Text ms={1} me={3}>{`${driverId ? driver : "Driver Needed"}`}</Text>
    </>
  );
}
