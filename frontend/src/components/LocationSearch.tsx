import { Input, Menu, MenuItem, MenuList } from "@chakra-ui/react";
import { LatLng } from "leaflet";
import * as React from "react";
import { useState } from "react";
import { Location } from "../firebase/database";
import { DEFAULT_CENTER } from "./MapView";

const MQ_PREDICTION_URI = "http://www.mapquestapi.com/search/v3/prediction";
const RESULT_LIMIT = 5;
const COLLECTION = "address,poi";

const LocationSearch = (props: { setLatLng: (pos: LatLng) => void }) => {
  const [query, setQuery] = useState("");
  const [displayedLocs, setDisplayedLocs] = useState<Location[]>();

  function getLocations() {
    if (query.length <= 2) {
      setDisplayedLocs([]);
      return;
    }
    /**
     * Here we are making the API call to the Prediction API
     * endpoint, then we compose the reponse to JSON.
     */
    return fetch(
      `${MQ_PREDICTION_URI}?key=${process.env.REACT_APP_MQ_KEY}` +
        `&q=${query}` +
        `&limit=${RESULT_LIMIT}` +
        `&collection=${COLLECTION}` +
        `&location=${DEFAULT_CENTER.lng},${DEFAULT_CENTER.lat}`
    )
      .then((res) => res.json())
      .catch((error) => console.log(error))
      .then((res) => {
        console.log(res.results);
        setDisplayedLocs(res.results as Location[]);
      });
  }
  return (
    <>
      <Input
        onChange={(e) => {
          setQuery(e.currentTarget.value);
          getLocations();
        }}
      />
      <Menu isOpen={displayedLocs && displayedLocs.length > 0}>
        <MenuList>
          {displayedLocs?.map((l: Location) => {
            return (
              <MenuItem
                onClick={() => {
                  const position = l.place.geometry.coordinates;
                  const latLng = new LatLng(position[1], position[0]);
                  props.setLatLng(latLng);
                }}
                key={l.id}
              >
                {l.displayString}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </>
  );
};

export default LocationSearch;
