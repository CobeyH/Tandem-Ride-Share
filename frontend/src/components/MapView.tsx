import React, { CSSProperties, ReactNode } from "react";
import { icon, LatLng, latLng, Map } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import startIconImg from "../images/Arrow Circle Up_8.png";
import endIconImg from "../images/Arrow Circle Down_8.png";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibWFyY3VzZHVubiIsImEiOiJja3ppeTllOTAxanBuMm9uMnRwMHZ1dmF6In0.gHleMGVyUBmw_na8Elfzdg";
export const DEFAULT_CENTER = latLng([48.46557, -123.314736]);
const DEFAULT_ZOOM = 12;
export const startIcon = icon({
  iconUrl: startIconImg,
  iconSize: [36, 36],
  iconAnchor: [18, 35],
});
export const endIcon = icon({
  iconUrl: endIconImg,
  iconSize: [36, 36],
  iconAnchor: [18, 35],
});

export default function MapView(
  props: MapView &
    MapObjCallback & { children?: ReactNode } & { style?: CSSProperties }
) {
  return (
    <MapContainer
      center={props.center ? props.center : DEFAULT_CENTER}
      zoom={props.zoom ? props.zoom : DEFAULT_ZOOM}
      scrollWheelZoom={true}
      whenCreated={props.setMap}
      style={props.style}
    >
      <ChangeView center={props.center} zoom={props.zoom} />
      <TileLayer
        url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        id="mapbox/streets-v11"
        accessToken={MAPBOX_ACCESS_TOKEN}
      />
      {props.children}
    </MapContainer>
  );
}

export function findMidpoint(
  a: LatLng | [number, number],
  b: LatLng | [number, number]
) {
  a = a instanceof LatLng ? a : latLng(a);
  b = b instanceof LatLng ? b : latLng(b);
  return latLng((a.lat + b.lat) / 2, (a.lng + b.lng) / 2);
}

type MapView = {
  center?: LatLng;
  zoom?: number;
};

type MapObjCallback = {
  setMap?: React.Dispatch<React.SetStateAction<Map | undefined>>;
};

function ChangeView({ center, zoom }: MapView) {
  const map = useMap();
  map.setView(center ? center : DEFAULT_CENTER, zoom ? zoom : DEFAULT_ZOOM);
  return null;
}
