import React, { useEffect } from "react";
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
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { defaultMapCenter } from "../pages/RidePage";

const mapBoxAccessToken =
  "pk.eyJ1IjoibWFyY3VzZHVubiIsImEiOiJja3ppeTllOTAxanBuMm9uMnRwMHZ1dmF6In0.gHleMGVyUBmw_na8Elfzdg";

export default function RideCard({ ride }: { ride: Ride }) {
  const { isOpen, onToggle } = useDisclosure();
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
      <Collapse in={isOpen}>
        <AspectRatio ratio={16 / 10} mt="2">
          <MapContainer
            center={defaultMapCenter}
            zoom={12}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              id="mapbox/streets-v11"
              accessToken={mapBoxAccessToken}
            />
            <MapRefresher />
          </MapContainer>
        </AspectRatio>
      </Collapse>
    </Box>
  );
}

function MapRefresher() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 400);
  });
  return null;
}
