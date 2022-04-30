import {
  endBefore,
  equalTo,
  get,
  orderByChild,
  orderByKey,
  orderByValue,
  push,
  query,
  ref,
  remove,
  set,
  startAt,
} from "firebase/database";
import { LatLng } from "leaflet";
import { useListVals, useObjectVal } from "react-firebase-hooks/database";
import { db } from "./firebase";
import slugify from "slugify";
import { getOptimizedRoute } from "../Directions";
import { PlanTypes } from "../components/Promotional/PriceSelector";

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

export type Group = {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  rides: { [key: string]: boolean };
  members: { [key: string]: boolean };
  owner: string;
  plan: PlanTypes;
  banner?: string;
  profilePic?: string;
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
  vehicles?: Vehicle[];
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
  pickupPoints: { [key: string]: PickupPoint };
};

export type Route = {
  boundingBox: {
    ul: { lat: number; lng: number };
    lr: { lat: number; lng: number };
  };
  shape: LatLng[];
  points: { [key: string]: RoutePoint };
};

export type RoutePoint = {
  distance: number; // kilometres
  duration: number; // seconds
  geocode: string;
};

export type PickupPoint = {
  id?: string;
  location: { lat: number; lng: number };
  members: { [key: string]: boolean };
};

export type Message = {
  sender_id: string;
  contents: string;
  timestamp: number;
};

export type Location = {
  id: string;
  displayString: string;
  name: string;
  place: {
    geometry: {
      coordinates: number[];
    };
  };
};

export const getGroup = async (groupId: string) => {
  const result = await get(ref(db, `${GROUPS}/${groupId}`));
  if (result.exists()) {
    const group = result.val();
    group.id = groupId;
    return group;
  } else {
    throw new Error("Result does not exist for groupId: " + groupId);
  }
};

export const useGroup = (groupId: string) => {
  return useObjectVal<Group>(ref(db, `${GROUPS}/${groupId}`), {
    keyField: "id",
  });
};

export const useGroups = () => {
  return useListVals<Group>(ref(db, GROUPS), { keyField: "id" });
};

export const setGroup = async (group: Group) => {
  const { id, ...groupData } = group;
  await set(ref(db, `${GROUPS}/${id}`), groupData);
  return group;
};

export const pushGroup = async (groupData: Omit<Group, "id">) => {
  let id = slugify(groupData.name, KEY_SLUG_OPTS);
  const groupsQuery = query(
    ref(db, GROUPS),
    orderByKey(),
    startAt(id),
    endBefore(
      id.slice(0, id.length - 1) +
        String.fromCharCode(id.charCodeAt(id.length - 1) + 1)
    )
  );
  const groups = await get(groupsQuery);
  if (groups.hasChild(id)) {
    let i = 1;
    while (groups.hasChild(id + i.toString())) i++;
    id = id + i.toString();
  }
  await set(ref(db, `${GROUPS}/${id}`), groupData);
  return { id, ...groupData };
};

export const useGroupChat = (groupId: string) => {
  const r = ref(db, `${GROUP_CHATS}/${groupId}`);
  const q = query(r, orderByChild("timestamp"));
  return useListVals<Message>(q, { keyField: "id" });
};

export const useRideChat = (rideId: string) => {
  const r = ref(db, `${RIDE_CHATS}/${rideId}`);
  const q = query(r, orderByChild("timestamp"));
  return useListVals<Message>(q, { keyField: "id" });
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

export const setUserInPickup = async (
  rideId: string,
  pickupId: string,
  userId: string,
  isPassenger = true
) => {
  if (rideId && pickupId) {
    // Set user in current pickup point
    set(
      ref(db, `${RIDES}/${rideId}/pickupPoints/${pickupId}/members/${userId}`),
      isPassenger ? true : null
    );
    if (isPassenger) {
      const ride = await getRide(rideId);
      if (ride.driver === userId) {
        setRideStart(rideId, pickupId);
      }
    }
  }
};

export const clearUserFromPickups = async (rideId: string, userId: string) => {
  if (!rideId || !userId) return;
  const ride = await getRide(rideId);
  await Promise.all(
    Object.keys(ride.pickupPoints ?? {}).map(async (k) => {
      if (
        ride.pickupPoints[k].members &&
        Object.keys(ride.pickupPoints[k].members ?? {}).includes(userId)
      ) {
        await set(
          ref(db, `${RIDES}/${rideId}/pickupPoints/${k}/members/${userId}`),
          null
        );
      }
    })
  );
};

export const usePickupPoint = (rideId: string, pickupId: string) => {
  return useObjectVal<PickupPoint>(
    ref(db, `${RIDES}/${rideId}/pickupPoints/${pickupId}`),
    {
      keyField: "id",
    }
  );
};

export const usePickupPointRoute = (rideId: string, pickupId: string) => {
  return useObjectVal<{ distance: number; duration: number }>(
    ref(db, `${ROUTES}/${rideId}/points/${pickupId}`)
  );
};

export const useRideStartDate = (rideId: string) => {
  return useObjectVal<string>(ref(db, `${RIDES}/${rideId}/startDate`));
};

export const setGroupBanner = async (groupId: string, banner?: string) => {
  return set(ref(db, `${GROUPS}/${groupId}/banner`), banner);
};

export const setGroupProfilePic = async (
  groupId: string,
  profilePic?: string
) => {
  return set(ref(db, `${GROUPS}/${groupId}/profilePic`), profilePic);
};

export const getUser = async (userId: string) => {
  const result = await get(ref(db, `${USERS}/${userId}`));
  if (result.exists()) {
    const user = result.val();
    return {
      uid: userId,
      name: user.name,
      authProvider: user.authProvider,
      email: user.email,
      vehicles: user.vehicles,
    };
  } else {
    throw new Error("User does not exist with Id " + userId);
  }
};

export const setUser = async (user: User) => {
  const { uid: uid, ...userData } = user;
  if (uid) await set(ref(db, `${USERS}/${uid}`), userData);
  return user;
};

export const useUser = (userId?: string) => {
  return useObjectVal<User>(ref(db, `${USERS}/${userId}`), {
    keyField: "uid",
  });
};

export const useUserVehicle = (userId?: string, vehicleId?: string) => {
  return useObjectVal<Vehicle>(
    userId && vehicleId
      ? ref(db, `${USERS}/${userId}/vehicles/${vehicleId}`)
      : null
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

export const deleteUserVehicle = async (userId: string, vehicle: Vehicle) => {
  const { carId } = vehicle;
  return remove(ref(db, `${USERS}/${userId}/vehicles/${carId}`));
};

export const setGroupMember = async (
  groupId: string,
  userId: string,
  isMember = true
) => {
  await set(
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

export const persistRide = async (ride: Ride): Promise<Ride> => {
  const { id, ...rideData } = ride;
  if (id) {
    console.log("Unexpected ID in Ride: " + id);
    throw new Error("Leave creating ID's to createRide");
  }
  const rideRef = push(ref(db, RIDES));
  if (!rideRef.key) {
    throw new Error("Unable to get ride id.");
  } else {
    await set(ref(db, `${RIDES}/${rideRef.key}`), rideData);
  }
  return { id: rideRef.key, ...rideData } as Ride;
};

export const getRide = async (rideId: string) => {
  const result = await get(ref(db, `${RIDES}/${rideId}`));
  if (result.exists()) {
    const ride: Ride = result.val();
    ride.id = rideId;
    return ride;
  } else {
    throw new Error("Ride does not exist with id " + rideId);
  }
};

export const useRide = (rideId: string) => {
  return useObjectVal<Ride>(ref(db, `${RIDES}/${rideId}`));
};

export const setRidePassenger = async (
  passId: string,
  rideId: string,
  isPassenger = true
) => {
  if (rideId && passId) {
    set(
      ref(db, `${PASSENGERS}/${rideId}/${passId}`),
      isPassenger ? true : null
    );
  }
  if (!isPassenger) {
    const ride = await getRide(rideId);
    if (ride.driver === passId) {
      setRideDriver(passId, rideId, undefined, false);
    }
  }
};

export const setRideDriver = async (
  driverId?: string,
  rideId?: string,
  carId?: string,
  state = true
) => {
  if (!rideId) return;
  set(
    ref(db, `${RIDES}/${rideId}/driver`),
    state ? (driverId ? driverId : null) : null
  );
  set(
    ref(db, `${RIDES}/${rideId}/carId`),
    state ? (carId ? carId : null) : null
  );
  if (state && driverId) {
    const ride = await getRide(rideId);
    const driverPointKey = Object.keys(ride.pickupPoints ?? {}).find((k) => {
      if (!ride.pickupPoints[k].members) return false;
      return Object.keys(ride.pickupPoints[k].members ?? {}).includes(driverId);
    });
    if (driverPointKey) setRideStart(rideId, driverPointKey);
  }
};

export const setRideStart = async (rideId: string, pickupId: string) => {
  await set(ref(db, `${RIDES}/${rideId}/start`), pickupId);
  const ride = await getRide(rideId);
  const route = await getOptimizedRoute(ride);
  await setRoute(rideId, route);
};

export const completeRide = (rideId: string) => {
  if (rideId) set(ref(db, `${RIDES}/${rideId}/isComplete`), true);
};

export const useRidePassenger = (rideId?: string, passId?: string) => {
  return useObjectVal(
    rideId && passId ? ref(db, `${PASSENGERS}/${rideId}/${passId}`) : null
  );
};

export const useRidePassengers = (rideId: string) => {
  return useListVals<User>(
    query(ref(db, `${PASSENGERS}/${rideId}`), orderByValue(), equalTo(true))
  );
};

export const setRoute = (rideId: string, route: Route) =>
  set(ref(db, `${ROUTES}/${rideId}`), route);

export const useRoute = (rideId: string) => {
  return useObjectVal<Route>(ref(db, `${ROUTES}/${rideId}`));
};

export const removeUserFromPickupPoints = async (
  userId: string,
  rideId: string
): Promise<void> => {
  const ride = await getRide(rideId);
  for (const pickupPoint of Object.values(ride.pickupPoints)) {
    if ((pickupPoint?.members ?? {})[userId]) {
      await setRide({
        ...ride,
        pickupPoints: Object.fromEntries(
          Object.keys(ride.pickupPoints ?? {}).reduce((acc, pickupPointKey) => {
            const pickupPointByKey = ride.pickupPoints[pickupPointKey];
            const newPickupPoint = {
              ...pickupPointByKey,
              members: Object.fromEntries(
                Object.keys(pickupPointByKey.members ?? {})
                  .filter((k) => k !== userId)
                  .reduce((acc, memberKey) => {
                    acc.set(memberKey, true);
                    return acc;
                  }, new Map<string, boolean>())
              ),
            };
            acc.set(pickupPointKey, newPickupPoint);
            return acc;
          }, new Map<string, PickupPoint>())
        ),
      });
    }
  }
};

const setRide = (ride: Ride) => set(ref(db, `${RIDES}/${ride.id}`), ride);

export const removeUserFromDriver = async (
  userId: string,
  rideId: string
): Promise<void> => {
  const currDriver = await get(ref(db, `${RIDES}/${rideId}/driver`));

  if (currDriver.val() === userId) {
    await set(ref(db, `${RIDES}/${rideId}/driver`), null);
  }
};

const removeUserFromPassengers = async (userId: string, rideId: string) =>
  remove(ref(db, `${PASSENGERS}/${rideId}/${userId}`));

export const removeUserFromRide = async (
  userId: string,
  rideId: string
): Promise<void> => {
  await removeUserFromDriver(userId, rideId);
  await removeUserFromPickupPoints(userId, rideId);
  await removeUserFromPassengers(userId, rideId);
};

export const removeUserFromGroup = async (
  userId: string,
  groupId: string
): Promise<void> => {
  const group = await getGroup(groupId);
  await Promise.all(
    Object.keys(group.rides ?? {}).map((rideId) =>
      removeUserFromRide(userId, rideId)
    )
  );
  await setGroup({
    ...group,
    members: Object.fromEntries(
      Object.keys(group.members ?? {})
        .filter((mem) => mem !== userId)
        .reduce((acc, member) => {
          acc.set(member, true);
          return acc;
        }, new Map<string, boolean>())
    ),
  });
};
