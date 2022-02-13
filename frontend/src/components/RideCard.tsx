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
import { MapContainer, TileLayer } from "react-leaflet";
import { defaultMapCenter } from "../pages/RidePage";

const mapBoxAccessToken =
  "pk.eyJ1IjoibWFyY3VzZHVubiIsImEiOiJja3ppeTllOTAxanBuMm9uMnRwMHZ1dmF6In0.gHleMGVyUBmw_na8Elfzdg";

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
          <MapContainer
            center={defaultMapCenter}
            zoom={12}
            scrollWheelZoom={true}
            whenCreated={setMap}
          >
            <TileLayer
              url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              id="mapbox/streets-v11"
              accessToken={mapBoxAccessToken}
            />
          </MapContainer>
        </AspectRatio>
      </Collapse>
    </Box>
  );
}
