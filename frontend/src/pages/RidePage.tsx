import React from 'react';
import { useParams } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { ref } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import { db } from "../firebase";
import { Box, Heading } from "@chakra-ui/react";
import { latLng, LatLng } from 'leaflet';

export default function RidePage() {
  const { rideId } = useParams();
  const [ride] = useObjectVal<Ride>(ref(db, "rides/" + rideId));
  let center = latLng([48.46557,-123.314736]);
  let startMarker, endMarker;
  if (ride) {
    center = findMidpoint(latLng(ride.start), latLng(ride.end));
    startMarker = <Marker position={ride.start}/>;
    endMarker = <Marker position={ride.end}/>;
  } else {
    startMarker = endMarker = null;
  }

  return (
    <Box>
      <Heading>{center.toString()}</Heading>
    <MapContainer 
      center={center} 
      zoom={12}
      scrollWheelZoom={false}
      >
      <ChangeView 
        center={center} 
        zoom={12} />
      { startMarker }
      { endMarker }
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

function findMidpoint(a: LatLng, b: LatLng) {
  return latLng((a.lat + b.lat) / 2, (a.lng + b.lng) / 2);
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