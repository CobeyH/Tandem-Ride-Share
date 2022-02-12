import React from "react";
import { useParams } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { ref } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import { db } from "../firebase";
import { Box, Heading } from "@chakra-ui/react";
import { latLng, LatLng } from "leaflet";
import { icon } from "leaflet";
import startIconImg from "../images/Arrow Circle Up_8.png";
import endIconImg from "../images/Arrow Circle Down_8.png";
import { Ride } from "./CreateRide";

const mapBoxAccessToken =
  "pk.eyJ1IjoibWFyY3VzZHVubiIsImEiOiJja3ppeTllOTAxanBuMm9uMnRwMHZ1dmF6In0.gHleMGVyUBmw_na8Elfzdg";

export const defaultMapCenter = latLng([48.46557, -123.314736]);

export default function RidePage() {
  const { rideId } = useParams();
  const [ride] = useObjectVal<Ride>(ref(db, "rides/" + rideId));
  let center = defaultMapCenter;
  let startMarker, endMarker;
  if (ride) {
    center = findMidpoint(latLng(ride.start), latLng(ride.end));
    const startIcon = icon({
      iconUrl: startIconImg,
      iconSize: [96, 96],
      iconAnchor: [48, 92],
    });
    const endIcon = icon({
      iconUrl: endIconImg,
      iconSize: [96, 96],
      iconAnchor: [48, 92],
    });
    startMarker = <Marker position={ride.start} icon={startIcon} />;
    endMarker = <Marker position={ride.end} icon={endIcon} />;
  } else {
    startMarker = endMarker = null;
  }

  return (
    <Box>
      <Heading>{center.toString()}</Heading>
      <MapContainer center={center} zoom={12} scrollWheelZoom={false}>
        <ChangeView center={center} zoom={12} />
        {startMarker}
        {endMarker}
        <TileLayer
          url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          id="mapbox/streets-v11"
          accessToken={mapBoxAccessToken}
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

type MapView = {
  center: LatLng;
  zoom: number;
};
