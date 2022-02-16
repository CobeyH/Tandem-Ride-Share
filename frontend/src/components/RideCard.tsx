import React, { useState } from "react";
import {
  AspectRatio,
  Box,
  Collapse,
  Flex,
  Heading,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Ride } from "../pages/CreateRide";
import MapView from "./MapView";

export default function RideCard({ ride }: { ride: Ride }) {
  const { isOpen, onToggle } = useDisclosure();
  const [map, setMap] = useState<L.Map | undefined>(undefined);

  return (
    <Box borderWidth="1px" borderRadius="lg" p="3" w="sm">
      <Flex onClick={onToggle}>
        <Heading size="md">{ride.name}</Heading>
        <Spacer />
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
          <MapView center={undefined} zoom={undefined} setMap={setMap} />
        </AspectRatio>
      </Collapse>
    </Box>
  );
}
