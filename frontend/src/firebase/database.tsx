import { get, ref, set } from "firebase/database";
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

export const setUserVehicle = async (userId: string, vehicle: Vehicle) => {
  const { carId, ...car } = vehicle;
  return set(ref(db, `${USERS}/${userId}/vehicles/${carId}`), car);
};
