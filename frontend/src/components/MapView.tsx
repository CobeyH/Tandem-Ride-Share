import React from "react";
import { LatLng, latLng, Map } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibWFyY3VzZHVubiIsImEiOiJja3ppeTllOTAxanBuMm9uMnRwMHZ1dmF6In0.gHleMGVyUBmw_na8Elfzdg";
const DEFAULT_CENTER = latLng([48.46557, -123.314736]);
const DEFAULT_ZOOM = 12;

export default function MapView(view: MapView & MapObjCallback) {
  return (
    <MapContainer
      center={view.center ? view.center : DEFAULT_CENTER}
      zoom={view.zoom ? view.zoom : DEFAULT_ZOOM}
      scrollWheelZoom={true}
      whenCreated={view.setMap}
    >
      <ChangeView center={view.center} zoom={view.zoom} />
      <TileLayer
        url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        id="mapbox/streets-v11"
        accessToken={MAPBOX_ACCESS_TOKEN}
      />
    </MapContainer>
  );
}

export function findMidpoint(a: LatLng, b: LatLng) {
  return latLng((a.lat + b.lat) / 2, (a.lng + b.lng) / 2);
}

type MapView = {
  center: LatLng | undefined;
  zoom: number | undefined;
};

type MapObjCallback = {
  setMap: React.Dispatch<React.SetStateAction<Map | undefined>>;
};

function ChangeView({ center, zoom }: MapView) {
  const map = useMap();
  map.setView(center ? center : DEFAULT_CENTER, zoom ? zoom : DEFAULT_ZOOM);
  return null;
}
