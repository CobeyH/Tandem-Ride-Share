import { Input } from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";

const MQ_PREDICTION_URI = "http://www.mapquestapi.com/search/v3/prediction";
const RESULT_LIMIT = 5;
const COLLECTION = "address,poi";

const LocationSearch = () => {
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
        `&collection=${COLLECTION}`
    )
      .then((res) => res.json())
      .catch((error) => console.log(error))
      .then((result) => {
        console.log(result);
        setDisplayedLocs(result as Location[]);
      });
  }
  return (
    <Input
      onChange={(e) => {
        setQuery(e.currentTarget.value);
        getLocations();
      }}
    ></Input>
  );
};

export default LocationSearch;
