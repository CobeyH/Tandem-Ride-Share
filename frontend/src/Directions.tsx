import { latLng, LatLng } from "leaflet";
import { PickupPoint, Route, RoutePoint } from "./firebase/database";

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
            boundingBox: result.route.boundingBox,
            shape: arrayToLatLngs(result.route.shape.shapePoints),
            points: {
              end: {
                distance: milesToKm(result.route.distance),
                duration: result.route.time,
                geocode: geocodeToString(result.route.locations[-1]),
              },
            },
          };
          resolve(route);
        },
        (error) => {
          reject(error);
        }
      );
  });
};

/**
 * Get an optimized Route object from the given points.
 * @param points List of PickupPoint locations, start at 0 and end at N-1.
 * @returns Route object for database storage.
 */
export const getOptimizedRoute = async (
  points: Omit<PickupPoint, "members" | "geocode">[]
) => {
  const data = {
    locations: points.map((point) => {
      return `${point.location.lat},${point.location.lng}`;
    }),
  };

  return new Promise<Route>((resolve, reject) => {
    let routePoints: { [key: string]: RoutePoint };
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
        routePoints = {
          end: {
            distance: milesToKm(res.route.distance),
            duration: res.route.time,
            geocode: geocodeToString(res.route.locations[-1]),
          },
        };
        // locationSequence is requested location indices sorted in the
        // optimized route order. Index 0 and N-1 are unchanged as the start
        // and end locations are static. 1 to N-2 are the pickup points.
        const sequence: number[] = res.route.locationSequence;
        sequence.slice(1, sequence.length - 1).map((loc, i) => {
          let distSum = 0,
            duraSum = 0;
          res.route.legs
            .slice(0, i + 1)
            .forEach((leg: { distance: number; time: number }) => {
              distSum = distSum + leg.distance;
              duraSum = duraSum + leg.time;
            });
          routePoints[points[loc].id ?? loc] = {
            distance: milesToKm(distSum),
            duration: duraSum,
            geocode: geocodeToString(res.route.locations[i]),
          };
        });
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
            boundingBox: res.route.boundingBox,
            shape: arrayToLatLngs(res.route.shape.shapePoints),
            points: routePoints,
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
