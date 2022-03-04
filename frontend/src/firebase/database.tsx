import { equalTo, get, orderByValue, query, ref, set } from "firebase/database";
import { LatLng } from "leaflet";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import { db } from "./firebase";

const GROUPS = "groups";
const USERS = "users";
const RIDES = "rides";
const PASSENGERS = "passengers";
const ROUTES = "routes";
const KEY_SLUG_OPTS = {
  replacement: "-",
  remove: undefined,
  lower: true,
  strict: true,
  locale: "en",
  trim: true,
};

export const DBConstants = {
  GROUPS,
  USERS,
  RIDES,
  PASSENGERS,
  ROUTES,
  KEY_SLUG_OPTS,
};

export type Vehicle = {
  carId?: string;
  type: string;
  fuelUsage: number;
  numSeats: number;
  displayName?: string;
};

export type User = {
  uid: string;
  name: string;
  authProvider: string;
  email: string;
  cars?: Vehicle[];
};

export type Ride = {
  name: string;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  driver?: string;
  isComplete: boolean;
  carId?: string;
  startDate: string;
  endDate: string;
};

export type Route = {
  distance: number;
  fuelUsed: number;
  shape: LatLng[];
};

export const getUser = async (userId: string) => {
  return new Promise<User>((resolve, reject) => {
    get(ref(db, `${USERS}/${userId}`)).then(
      (result) => {
        if (result.exists()) {
          const user = result.val();
          resolve({
            uid: userId,
            name: user.name,
            authProvider: user.authProvider,
            email: user.email,
            cars: user.cars,
          });
        } else {
          reject(undefined);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const setUser = async (user: User) => {
  return set(ref(db, `${USERS}/${user.uid}`), user);
};

export const useUser = (userId?: string) => {
  return useObjectVal<User>(ref(db, `${USERS}/${userId}`));
};

export const useUserVehicle = (userId?: string, vehicleId?: string) => {
  return useObjectVal<Vehicle>(
    ref(db, `${USERS}/${userId}/vehicles/${vehicleId}`)
  );
};

export const useUserVehicles = (userId?: string) => {
  return useListVals<Vehicle>(ref(db, `${USERS}/${userId}/vehicles`), {
    keyField: "carId",
  });
};

export const setUserVehicle = async (userId: string, vehicle: Vehicle) => {
  const { carId, ...car } = vehicle;
  return set(ref(db, `${USERS}/${userId}/vehicles/${carId}`), car);
};

export const setGroupMember = async (
  groupId: string,
  userId: string,
  isMember = true
) => {
  set(
    ref(db, `${GROUPS}/${groupId}/members/${userId}`),
    isMember ? true : null
  );
};

export const useRide = (rideId: string) => {
  return useObjectVal<Ride>(ref(db, `${RIDES}/${rideId}`));
};

export const setRidePassenger = (
  passId: string,
  rideId: string,
  isPassenger = true
) => {
  set(ref(db, `${PASSENGERS}/${rideId}/${passId}`), isPassenger ? true : null);
};

export const setRideDriver = (
  driverId: string,
  rideId: string,
  state: boolean,
  carId: string | undefined
) => {
  set(ref(db, `${RIDES}/${rideId}/driver`), state ? driverId : null);
  set(ref(db, `${RIDES}/${rideId}/carId`), state ? carId : null);
};

export const completeRide = (rideId: string) => {
  set(ref(db, `${RIDES}/${rideId}/isComplete`), true);
};

export const useRidePassenger = (rideId: string, passId: string) => {
  return useObjectVal(ref(db, `${PASSENGERS}/${rideId}/${passId}`));
};

export const useRidePassengers = (rideId: string) => {
  return useListVals<User>(
    query(ref(db, `${PASSENGERS}/${rideId}`), orderByValue(), equalTo(true))
  );
};

export const useRoute = (rideId: string) => {
  return useObjectVal<Route>(ref(db, `${ROUTES}/${rideId}`));
};
