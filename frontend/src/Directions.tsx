import { latLng, LatLng } from "leaflet";
import { RideRoute } from "./pages/CreateRide";

/**
 * MapQuest Open Directions API functions and components.
 */
const MQ_DIR_URI = "https://open.mapquestapi.com/directions/v2/route";
const MQ_KEY = process.env.MQ_KEY;

export const getRideRoute = async (start: LatLng, end: LatLng) => {
  return new Promise<RideRoute>((resolve, reject) => {
    /**
     * Here we are making the first API call to the Directions API Route
     * endpoint. Then we compose the reponse to JSON, then use the result
     * to make a second call to the RouteShape enpoint which only accepts
     * a sessionId.
     */
    fetch(
      `${MQ_DIR_URI}?key=${MQ_KEY}` +
        `&from=${start.lat},${start.lng}&to=${end.lat},${end.lng}` +
        `&unit=k&fullShape=true`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          const route: RideRoute = {
            distance: result.route.distance,
            fuelUsed: result.route.fuelUsed,
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
