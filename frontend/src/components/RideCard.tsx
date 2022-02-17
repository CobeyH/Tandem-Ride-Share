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
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import { db, DB_PASSENGERS_COLLECT, DB_USER_COLLECT, User } from "../firebase";
import { ref } from "firebase/database";

export default function RideCard({ ride }: { ride: Ride }) {
  const { isOpen, onToggle } = useDisclosure();
  const [map, setMap] = useState<L.Map | undefined>(undefined);
  let center, startMarker, endMarker, maxPassengers, passengers, driver;
  if (ride) {
    center = findMidpoint(ride.start as LatLng, ride.end as LatLng);
    startMarker = <Marker position={ride.start} icon={startIcon} />;
    endMarker = <Marker position={ride.end} icon={endIcon} />;
    maxPassengers = ride.maxPassengers;

    const [passVals, passLoading, passError] = useListVals<string>(
      ref(db, `${DB_PASSENGERS_COLLECT}/${ride.id}`)
    );
    passengers = passLoading ? "?" : passError ? "0" : passVals?.length;

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
            {/* Passengers Display */}
            <Icon as={BsFillPersonFill} w={6} h={6} />
            <Text ms={1} me={3}>{`${passengers} / ${maxPassengers}`}</Text>
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
          {/* Driver Display */}
          <Icon as={AiFillCar} w={6} h={6} />
          <Text ms={1} me={3}>{`${driver ? driver : "Driver Needed"}`}</Text>
          <Spacer />
          <Button>Join as Driver</Button>
        </Flex>
        <Flex flexDirection="row" m={2} align="center">
          {/* Passengers Display */}
          <Icon as={BsFillPersonFill} w={6} h={6} />
          <Text ms={1} me={3}>{`${passengers} / ${maxPassengers}`}</Text>
          <Spacer />
          <Button
            onClick={() => {
              addPassengerToRide("1", ride);
            }}
          >
            Join as Passenger
          </Button>
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

function addPassengerToRide(passId: string, ride: Ride) {
  console.log(`${passId}:${ride.id}`);
}
