import { latLng, LatLng } from "leaflet";
import { Route } from "./firebase/database";

const milesToKm = (m: number) => {
  return m * 1.609344;
};

/**
 * MapQuest Open Directions API functions and components.
 */
const MQ_DIR_URI = "https://open.mapquestapi.com/directions/v2/";
const MQ_ROUTE_ENDPOINT = "route";
const MQ_SHAPE_ENDPOINT = "routeshape";
const MQ_OPTIMIZED_ENDPOINT = "optimizedroute";
const MQ_REV_GEOCODE_URI = "https://www.mapquestapi.com/geocoding/v1/reverse";

export const getRideRoute = async (start: LatLng, end: LatLng) => {
  return new Promise<Route>((resolve, reject) => {
    /**
     * Here we are making the API call to the Directions API Route
     * endpoint, then we compose the reponse to JSON.
     */
    fetch(
      `${MQ_DIR_URI + MQ_ROUTE_ENDPOINT}?key=${process.env.REACT_APP_MQ_KEY}` +
        `&from=${start.lat},${start.lng}&to=${end.lat},${end.lng}` +
        `&fullShape=true`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          const route: Route = {
            distance: milesToKm(result.route.distance),
            duration: result.route.time,
            boundingBox: result.route.boundingBox,
            shape: arrayToLatLngs(result.route.shape.shapePoints),
          };
          resolve(route);
        },
        (error) => {
          reject(error);
        }
      );
  });
};

export const getOptimizedRoute = async (points: LatLng[]) => {
  const data = {
    locations: points.map((point) => {
      return `${point.lat},${point.lng}`;
    }),
  };

  return new Promise<Route>((resolve, reject) => {
    let distance: number, duration: number;
    /**
     * Here we are making the API call to the Directions API Optimized
     * Route endpoint, then we compose the reponse to JSON.
     */
    fetch(
      MQ_DIR_URI +
        MQ_OPTIMIZED_ENDPOINT +
        `?key=${process.env.REACT_APP_MQ_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        distance = milesToKm(res.route.distance);
        duration = res.route.time;
        return res;
      })
      .then((res) =>
        fetch(
          MQ_DIR_URI +
            MQ_SHAPE_ENDPOINT +
            `?key=${process.env.REACT_APP_MQ_KEY}` +
            `&sessionId=${res.route.sessionId}&fullShape=true`
        )
      )
      .then((res) => res.json())
      .then(
        (res) => {
          const route: Route = {
            distance: distance,
            duration: duration,
            boundingBox: res.route.boundingBox,
            shape: arrayToLatLngs(res.route.shape.shapePoints),
          };
          resolve(route);
        },
        (err) => reject(err)
      );
  });
};

export const getReverseGeocode = async (point: LatLng): Promise<Geocode> => {
  const res = await fetch(
    MQ_REV_GEOCODE_URI +
      `?key=${process.env.REACT_APP_MQ_KEY}` +
      `&location=${point.lat},${point.lng}`
  );
  const json = await res.json();
  const location = json.results[0].locations[0];
  return location as Geocode;
};

export const getReverseGeocodeAsString = async (point: LatLng) => {
  const location = await getReverseGeocode(point);
  return geocodeToString(location);
};

export type Geocode = {
  street: string;
  adminArea5: string;
  adminArea3: string;
  adminArea1: string;
  postalCode: string;
};

function geocodeToString(geocode: Geocode) {
  const arr = [
    geocode.street,
    geocode.adminArea5,
    geocode.adminArea3,
    geocode.adminArea1,
  ];
  return arr.join(", ");
}

/**
 * MapQuest Directions RouteShape API returns flat array of decimal lat and lng.
 * @param array Array of numbers [ lat0, lng0, lat1, lng1, ... ]
 * @returns Array of LatLng [ LatLng0, LatLng1, ... ]
 */
function arrayToLatLngs(array: Array<number>) {
  if (array.length % 2 !== 0) {
    throw new RangeError("Array length must be even.");
  } else {
    const result = [];
    for (let i = 0; i < array.length; i += 2) {
      result.push(latLng(array[i], array[i + 1]));
    }
    return result;
  }
}
