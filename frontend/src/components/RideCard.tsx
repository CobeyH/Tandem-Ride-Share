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
import { Ride } from "../pages/CreateRide";
import MapView, { endIcon, findMidpoint, startIcon } from "./MapView";
import { Marker } from "react-leaflet";
import { LatLng } from "leaflet";

export default function RideCard({ ride }: { ride: Ride }) {
  const { isOpen, onToggle } = useDisclosure();
  const [map, setMap] = useState<L.Map | undefined>(undefined);
  let center, startMarker, endMarker, maxPassengers, passengers;
  if (ride) {
    center = findMidpoint(ride.start as LatLng, ride.end as LatLng);
    startMarker = <Marker position={ride.start} icon={startIcon} />;
    endMarker = <Marker position={ride.end} icon={endIcon} />;
    maxPassengers = ride.maxPassengers;
    passengers = Object.keys(ride.passengers).length;
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p="3" minW="sm">
      <Flex onClick={onToggle}>
        <Heading size="md">{ride.name}</Heading>
        <Spacer />
        <Icon as={BsFillPersonFill} w={6} h={6} />
        <Text mx={1}>{`${passengers} / ${maxPassengers}`}</Text>
        {isOpen ? (
          <ChevronUpIcon w={6} h={6} />
        ) : (
          <ChevronDownIcon w={6} h={6} />
        )}
      </Flex>
      <Collapse
        in={isOpen}
        onAnimationComplete={() => {
          if (map && isOpen) map.invalidateSize();
        }}
      >
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
