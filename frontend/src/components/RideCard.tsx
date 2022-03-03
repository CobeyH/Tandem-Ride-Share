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
import { Ride, RideRoute } from "../pages/CreateRide";
import MapView, { endIcon, findMidpoint, startIcon } from "./MapView";
import { Marker, Polyline } from "react-leaflet";
import { latLng, LatLng, latLngBounds } from "leaflet";
import { useList, useObjectVal } from "react-firebase-hooks/database";
import {
  auth,
  db,
  DB_PASSENGERS_COLLECT,
  DB_RIDE_COLLECT,
  DB_ROUTE_COLLECT,
  DB_USER_COLLECT,
  User,
  Vehicle,
} from "../firebase";
import { equalTo, orderByValue, query, ref, set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import ChooseCar from "./ChooseCar";

export default function RideCard({
  rideId,
  viewOnly,
  isActive,
}: {
  rideId: string;
  viewOnly?: boolean;
  isActive?: boolean;
}) {
  const [user] = useAuthState(auth);
  const [ride, rideLoading, rideError] = useObjectVal<Ride>(
    ref(db, `${DB_RIDE_COLLECT}/${rideId}`)
  );
  const [route] = useObjectVal<RideRoute>(
    ref(db, `${DB_ROUTE_COLLECT}/${rideId}`)
  );
  const [car] = useObjectVal<Vehicle>(
    ref(db, `${DB_USER_COLLECT}/${user?.uid}/vehicles/${ride?.carId}`)
  );
  const { isOpen, onToggle } = useDisclosure();
  const [map, setMap] = useState<L.Map | undefined>(undefined);

  let center, startMarker, endMarker;
  if (ride !== undefined) {
    center = findMidpoint(ride.start as LatLng, ride.end as LatLng);
    startMarker = <Marker position={ride.start} icon={startIcon} />;
    endMarker = <Marker position={ride.end} icon={endIcon} />;
  }

  return !ride?.isComplete == isActive ? (
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
                  rideId={rideId}
                  maxPass={car?.numSeats || 4}
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
              {user && !viewOnly && isActive ? (
                <DriverButton rideId={rideId} userId={user.uid} />
              ) : (
                ""
              )}
            </Flex>
            <Flex flexDirection="row" m={2} align="center">
              <PassengerCounter rideId={rideId} maxPass={car?.numSeats || 4} />
              <Spacer />
              {user && !viewOnly && isActive ? (
                <PassengerButton rideId={rideId} userId={user.uid} />
              ) : (
                ""
              )}
            </Flex>
            {ride.startDate && ride.endDate ? (
              <RideTimes startTime={ride.startDate} endTime={ride.endDate} />
            ) : null}
            <AspectRatio ratio={16 / 10} mt="2">
              <MapView center={center} zoom={undefined} setMap={setMap}>
                {startMarker}
                {endMarker}
                {route && <Polyline positions={route.shape} />}
              </MapView>
            </AspectRatio>
            <Flex flexDirection="row" m={2} align="center">
              {user && !ride?.isComplete && user.uid == ride.driver && (
                <CompleteRideButton rideId={rideId} />
              )}
            </Flex>
          </Collapse>
        </>
      )}
    </Box>
  ) : null;
}

function setRidePassenger(passId: string, rideId: string, state: boolean) {
  set(ref(db, `${DB_PASSENGERS_COLLECT}/${rideId}/${passId}`), state);
}

function setRideDriver(
  driverId: string,
  rideId: string,
  state: boolean,
  carId: string | undefined
) {
  set(ref(db, `${DB_RIDE_COLLECT}/${rideId}/driver`), state ? driverId : null);
  set(ref(db, `${DB_RIDE_COLLECT}/${rideId}/carId`), state ? carId : null);
}

function completeRide(rideId: string) {
  set(ref(db, `${DB_RIDE_COLLECT}/${rideId}/isComplete`), true);
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
  const [car, setCar] = useState<Vehicle>();
  const amDriver = driver === userId;
  return !loading && error === undefined ? (
    <>
      <ChooseCar carUpdate={setCar} />
      <Button
        isDisabled={car == undefined}
        onClick={() => {
          setRideDriver(userId, rideId, !amDriver, car?.carId);
        }}
      >
        {amDriver ? "Leave" : "Join"}
      </Button>
    </>
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

function CompleteRideButton({ rideId }: { rideId: string }) {
  return (
    <Button
      width="full"
      mt={4}
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

function RideTimes({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) {
  // make time strings pretty
  const start_date = startTime?.split("T")[0];
  let start_time = startTime?.split("T")[1];
  const isPm_start = parseInt(start_time.split(":")[0]) >= 12;

  start_time = isPm_start
    ? `${parseInt(start_time.split(":")[0]) - 12}:${parseInt(
        start_time.split(":")[1]
      )}`
    : start_time;

  const end_date = endTime?.split("T")[0];
  let end_time = endTime?.split("T")[1];
  const isPm_end = parseInt(end_time?.split(":")[0]) >= 12;

  end_time = isPm_end
    ? `${parseInt(end_time?.split(":")[0]) - 12}:${parseInt(
        end_time?.split(":")[1]
      )}`
    : end_time;

  return (
    <>
      <Flex flexDirection="row" m={2} align="center">
        <Text>Start Date</Text>
        <Spacer />
        <Text>
          {start_date} {start_time} {isPm_start ? "PM" : "AM"}
        </Text>
      </Flex>
      <Flex flexDirection="row" m={2} align="center">
        <Text>End Date</Text>
        <Spacer />
        <Text>
          {end_date} {end_time} {isPm_end ? "PM" : "AM"}
        </Text>
      </Flex>
    </>
  );
}
