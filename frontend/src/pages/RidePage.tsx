import React from 'react';
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { ref } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import { db } from "../firebase";
import { Box, Heading } from "@chakra-ui/react";
import { latLng, LatLng } from 'leaflet';

export default function RidePage() {
  const { rideId } = useParams();
  const [ride] = useObjectVal<Ride>(ref(db, "rides/" + rideId));
  const center = latLng(ride?ride.end:[48.46557,-123.314736]);

  return (
    <Box>
      <Heading>{ride?ride.start:[0,0]}</Heading>
    <MapContainer 
      center={center} 
      zoom={12}
      scrollWheelZoom={false}
      >
      <ChangeView 
        center={center} 
        zoom={12} />
      <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
    </Box>
  );
}

function ChangeView({ center, zoom }: MapView) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export type Ride = {
  title: string;
  start: [number, number];
  end: [number, number];
}

type MapView = {
  center: LatLng;
  zoom: number;
}