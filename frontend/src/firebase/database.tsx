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
import { latLng, LatLng } from "leaflet";
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
  distance: number;
  boundingBox: {
    ul: { lat: number; lng: number };
    lr: { lat: number; lng: number };
  };
  shape: LatLng[];
};

export type PickupPoint = {
  id?: string;
  location: { lat: number; lng: number };
  members: { [key: string]: boolean };
  geocode?: string;
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

export const setUserInPickup = (
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
    if (isPassenger)
      getRide(rideId).then((ride) => {
        if (ride.driver === userId) {
          setRideStart(rideId, pickupId);
        }
      });
  }
};

export const clearUserFromPickups = async (rideId: string, userId: string) => {
  if (!rideId || !userId) return;
  return getRide(rideId).then((ride) => {
    Object.keys(ride.pickupPoints).map((k) => {
      if (
        ride.pickupPoints[k].members &&
        Object.keys(ride.pickupPoints[k].members).includes(userId)
      ) {
        set(
          ref(db, `${RIDES}/${rideId}/pickupPoints/${k}/members/${userId}`),
          null
        );
      }
    });
  });
};

export const usePickupPoint = (rideId: string, pickupId: string) => {
  return useObjectVal<PickupPoint>(
    ref(db, `${RIDES}/${rideId}/pickupPoints/${pickupId}`),
    {
      keyField: "id",
    }
  );
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
            vehicles: user.vehicles,
          });
        } else {
          reject(`failed to resolve user "${userId}" in getUser`);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
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
  if (!isPassenger)
    getRide(rideId).then((ride) => {
      if (ride.driver === passId) {
        setRideDriver(passId, rideId, undefined, false);
      }
    });
};

export const setRideDriver = (
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
    getRide(rideId)
      .then((ride) => {
        const driverPointKey = Object.keys(ride.pickupPoints).find((k) => {
          if (!ride.pickupPoints[k].members) return false;
          return Object.keys(ride.pickupPoints[k].members).includes(driverId);
        });
        if (driverPointKey) setRideStart(rideId, driverPointKey);
      })
      .catch((err) => console.log(err));
  }
};

export const setRideStart = (rideId: string, pickupId: string) => {
  set(ref(db, `${RIDES}/${rideId}/start`), pickupId)
    .then(() => getRide(rideId))
    .then((ride) => {
      // Fetch optimized route for new points
      const routePoints = [latLng(ride.pickupPoints[ride.start].location)];
      Object.keys(ride.pickupPoints).map((k) => {
        if (k === ride.start) return;
        routePoints.push(latLng(ride.pickupPoints[k].location));
      });
      routePoints.push(latLng(ride.end));
      return getOptimizedRoute(routePoints);
    })
    .then((route) => {
      setRoute(rideId, route);
    });
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

export const setRoute = (rideId: string, route: Route) => {
  if (rideId) set(ref(db, `${ROUTES}/${rideId}`), route);
};

export const useRoute = (rideId: string) => {
  return useObjectVal<Route>(ref(db, `${ROUTES}/${rideId}`));
};

export const removeUserFromPickupPoints = async (
  userId: string,
  rideId: string
): Promise<void> => {
  const ride = await getRide(rideId);
  for (const pickupPoint of Object.values(ride.pickupPoints)) {
    if (pickupPoint.members[userId]) {
      await setRide({
        ...ride,
        pickupPoints: Object.fromEntries(
          Object.keys(ride.pickupPoints).reduce((acc, pickupPointKey) => {
            const pickupPointByKey = ride.pickupPoints[pickupPointKey];
            const newPickupPoint = {
              ...pickupPointByKey,
              members: Object.fromEntries(
                Object.keys(pickupPointByKey.members)
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

export const removeUserFromRide = async (
  userId: string,
  rideId: string
): Promise<void> => {
  await removeUserFromDriver(userId, rideId);
  await removeUserFromPickupPoints(userId, rideId);
};

export const removeUserFromGroup = async (
  userId: string,
  groupId: string
): Promise<void> => {
  const group = await getGroup(groupId);
  await Promise.all(
    Object.keys(group.rides).map((rideId) => removeUserFromRide(userId, rideId))
  );
  await setGroup({
    ...group,
    members: Object.fromEntries(
      Object.keys(group.members)
        .filter((mem) => mem !== userId)
        .reduce((acc, member) => {
          acc.set(member, true);
          return acc;
        }, new Map<string, boolean>())
    ),
  });
};
