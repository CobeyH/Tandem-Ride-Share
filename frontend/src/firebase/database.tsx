import {
  equalTo,
  get,
  orderByValue,
  push,
  query,
  ref,
  set,
} from "firebase/database";
import { LatLng } from "leaflet";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import { db } from "./firebase";
import slugify from "slugify";

const GROUPS = "groups";
const USERS = "users";
const RIDES = "rides";
const PASSENGERS = "passengers";
const ROUTES = "routes";
const GROUP_CHATS = "chats/groups";
const RIDE_CHATS = "chats/rides";
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

export type Group = {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  rides: { [key: string]: boolean };
  members: { [key: string]: boolean };
  owner: string;
  banner?: string;
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
  id?: string;
  name: string;
  start: string;
  end: { lat: number; lng: number };
  driver?: string;
  isComplete: boolean;
  carId?: string;
  startDate: string;
  endDate: string;
  pickupPoints: { [key: string]: PickupPoint };
};

export type Route = {
  distance: number;
  fuelUsed: number;
  shape: LatLng[];
};

export type PickupPoint = {
  location: { lat: number; lng: number };
  members: { [key: string]: boolean };
};

export type Message = {
  sender_id: string;
  contents: string;
  timestamp: number;
};

export const getGroup = async (groupId: string) => {
  return new Promise<Group>((resolve, reject) => {
    get(ref(db, `${GROUPS}/${groupId}`)).then(
      (result) => {
        if (result.exists()) {
          const group = result.val();
          group.id = groupId;
          resolve(group);
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

export const useGroup = (groupId: string) => {
  return useObjectVal<Group>(ref(db, `${GROUPS}/${groupId}`), {
    keyField: "id",
  });
};

export const useGroups = () => {
  return useListVals<Group>(ref(db, GROUPS), { keyField: "id" });
};

export const useGroupChat = (groupId: string) => {
  return useListVals<Message>(ref(db, `${GROUP_CHATS}/${groupId}`), {
    keyField: "id",
  });
};

export const useRideChat = (groupId: string) => {
  return useListVals<Message>(ref(db, `${RIDE_CHATS}/${groupId}`), {
    keyField: "id",
  });
};

export const makeEmptyGroupChat = (groupId: string) => {
  return set(ref(db, `${GROUP_CHATS}/${groupId}`), []);
};

export const makeEmptyRideChat = (groupId: string) => {
  return set(ref(db, `${GROUP_CHATS}/${groupId}`), []);
};

const addChatToChat = (
  chat_location: string,
  message: Omit<Message, "timestamp">
) =>
  set(ref(db, `${chat_location}/${slugify(message.sender_id + Date.now())}`), {
    ...message,
    timestamp: Date.now(),
  });

export const addChatToGroupChat = (
  groupId: string,
  message: Omit<Message, "timestamp">
) => addChatToChat(`${GROUP_CHATS}/${groupId}`, message);

export const addChatToRideChat = (
  rideId: string,
  message: Omit<Message, "timestamp">
) => addChatToChat(`${RIDE_CHATS}/${rideId}`, message);

export const addPickupToRide = (rideId: string, pickup: PickupPoint) => {
  return push(ref(db, `${RIDES}/${rideId}/pickupPoints`), pickup);
};

export const setUserInPickup = (
  rideId: string,
  pickupId: string,
  userId: string,
  isPassenger = true
) => {
  if (rideId && pickupId)
    set(
      ref(db, `${RIDES}/${rideId}/pickupPoints/${pickupId}/members/${userId}`),
      isPassenger ? true : null
    );
  setRidePassenger(userId, rideId, isPassenger);
};

export const setGroup = async (group: Group) => {
  const { id, ...groupData } = group;
  if (id) await set(ref(db, `${GROUPS}/${id}`), groupData);
  return group;
};

export const setGroupBanner = async (groupId: string, banner?: string) => {
  return set(ref(db, `${GROUPS}/${groupId}/banner`), banner);
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
  const { uid, ...userData } = user;
  if (uid) await set(ref(db, `${USERS}/${uid}`), userData);
  return user;
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

export const setGroupRide = async (
  groupId: string,
  rideId: string,
  isChild = true
) => {
  await set(
    ref(db, `${GROUPS}/${groupId}/rides/${rideId}`),
    isChild ? true : null
  );
};

export const setRide = (ride: Ride) => {
  const { id, ...rideData } = ride;
  if (id) console.log("Unexpected ID in Ride: " + id);
  const rideRef = push(ref(db, RIDES));
  if (!rideRef.key) throw new Error("Unable to get ride id.");
  else set(ref(db, `${RIDES}/${rideRef.key}`), rideData);
  return { id: rideRef.key, ...rideData } as Ride;
};

export const getRide = async (rideId: string) => {
  return new Promise<Ride>((resolve, reject) => {
    get(ref(db, `${RIDES}/${rideId}`)).then(
      (result) => {
        if (result.exists()) {
          const ride: Ride = result.val();
          ride.id = rideId;
          resolve(ride);
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

export const useRide = (rideId: string) => {
  return useObjectVal<Ride>(ref(db, `${RIDES}/${rideId}`));
};

export const setRidePassenger = (
  passId: string,
  rideId: string,
  isPassenger = true
) => {
  if (rideId && passId)
    set(
      ref(db, `${PASSENGERS}/${rideId}/${passId}`),
      isPassenger ? true : null
    );
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
  if (rideId) set(ref(db, `${RIDES}/${rideId}/isComplete`), true);
};

export const useRidePassenger = (rideId: string, passId: string) => {
  return useObjectVal(ref(db, `${PASSENGERS}/${rideId}/${passId}`));
};

export const useRidePassengers = (rideId: string) => {
  return useListVals<User>(
    query(ref(db, `${PASSENGERS}/${rideId}`), orderByValue(), equalTo(true))
  );
};

export const setRoute = (rideId: string, route: Route) => {
  if (rideId) set(ref(db, `${ROUTES}/${rideId}`), route);
};

export const useRoute = (rideId: string) => {
  return useObjectVal<Route>(ref(db, `${ROUTES}/${rideId}`));
};
