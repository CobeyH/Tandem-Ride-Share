import React, { useState } from "react";
import {
  AspectRatio,
  Box,
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
import { latLng, LatLng, latLngBounds } from "leaflet";
import { useList, useObjectVal } from "react-firebase-hooks/database";
import {
  auth,
  db,
  DB_PASSENGERS_COLLECT,
  DB_RIDE_COLLECT,
  DB_USER_COLLECT,
  User,
  Vehicle,
} from "../firebase";
import { equalTo, orderByValue, query, ref } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PreviousRides({ rideId }: { rideId: string }) {
  const [user] = useAuthState(auth);
  const [ride, rideLoading, rideError] = useObjectVal<Ride>(
    ref(db, `${DB_RIDE_COLLECT}/${rideId}`)
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

  return ride?.isComplete ? (
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
                  ])
                );
              }
            }}
          >
            <Flex flexDirection="row" m={2} align="center">
              <DriverDisplay
                driverId={ride.driver}
                displayDriverName={isOpen}
              />
            </Flex>
            <Flex flexDirection="row" m={2} align="center">
              <PassengerCounter rideId={rideId} maxPass={car?.numSeats || 4} />
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
  ) : (
    <></>
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
        <Text ms={1} me={3}>{`${driverId ? driver : "No driver"}`}</Text>
      ) : null}
    </>
  );
}
