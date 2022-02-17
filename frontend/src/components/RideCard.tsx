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
  DB_USER_COLLECT,
  User,
} from "../firebase";
import { equalTo, orderByValue, query, ref, set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";

export default function RideCard({ ride }: { ride: Ride }) {
  const [user] = useAuthState(auth);
  const { isOpen, onToggle } = useDisclosure();
  const [map, setMap] = useState<L.Map | undefined>(undefined);
  let center, startMarker, endMarker, maxPassengers, passengers, driver;
  if (ride) {
    center = findMidpoint(ride.start as LatLng, ride.end as LatLng);
    startMarker = <Marker position={ride.start} icon={startIcon} />;
    endMarker = <Marker position={ride.end} icon={endIcon} />;

    const [driverUser, driverLoading, driverError] = useObjectVal<User>(
      ref(db, `${DB_USER_COLLECT}/${ride.driver}`)
    );
    driver = driverLoading
      ? "Loading"
      : driverError
      ? "Error"
      : driverUser?.name;
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p="3" minW="sm">
      <Flex onClick={onToggle}>
        <Heading size="md">{ride.name}</Heading>
        <Spacer />
        {isOpen ? (
          <ChevronUpIcon w={6} h={6} />
        ) : (
          <>
            {/* Driver Display */}
            <Icon as={AiFillCar} w={6} h={6} />
            <Text ms={1} me={3}>{`${driver ? driver : "Driver Needed"}`}</Text>
            <ChevronDownIcon w={6} h={6} />
            <PassengerCounter rideId={ride.id} maxPass={ride.maxPassengers} />
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
          {/* Driver Display */}
          <Icon as={AiFillCar} w={6} h={6} />
          <Text ms={1} me={3}>{`${driver ? driver : "Driver Needed"}`}</Text>
          <Spacer />
          <Button>Join as Driver</Button>
        </Flex>
        <Flex flexDirection="row" m={2} align="center">
          <PassengerCounter rideId={ride.id} maxPass={ride.maxPassengers} />
          <Spacer />
          {user ? <PassengerButton rideId={ride.id} userId={user.uid} /> : ""}
        </Flex>
        <AspectRatio ratio={16 / 10} mt="2">
          <MapView center={center} zoom={undefined} setMap={setMap}>
            {startMarker}
            {endMarker}
          </MapView>
        </AspectRatio>
      </Collapse>
    </Box>
  );
}

function setRidePassenger(passId: string, rideId: string, state: boolean) {
  set(ref(db, `${DB_PASSENGERS_COLLECT}/${rideId}/${passId}`), state);
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
