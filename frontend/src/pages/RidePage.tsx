import React from 'react';
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import { ref } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import { db } from "../firebase";
import { Box, Heading } from "@chakra-ui/react";

export default function RidePage() {
  const { rideId } = useParams();
  const [ride] = useObjectVal<Ride>(ref(db, "rides/" + rideId));

  return (
    <Box>
      <Heading>{ride?ride.start:[0,0]}</Heading>
    <MapContainer 
      center={ride?ride.start:[0,0]} 
      zoom={12}
      scrollWheelZoom={false}
      >
      <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
    </Box>
  );
}

export type Ride = {
  title: string;
  start: [number, number];
  end: [number, number];
}