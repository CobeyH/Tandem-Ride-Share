import { Button, Heading, Icon, Text } from "@chakra-ui/react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import {
  clearUserFromPickups,
  getUser,
  PickupPoint,
  setRidePassenger,
  setUserInPickup,
  usePickupPoint,
  usePickupPointRoute,
  User,
  useRideStartDate,
} from "../../firebase/database";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import { Geocode, getReverseGeocode } from "../../Directions";
import { divIcon, LatLng } from "leaflet";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { lightTheme } from "../../theme/colours";
import { timeStamp } from "console";

const PickupMarkers = (props: {
  rideId: string;
  pickups: { [key: string]: PickupPoint } | undefined;
}) => {
  if (!props.pickups) return null;
  return (
    <>
      {Object.entries(props.pickups).map(([key, point]) => {
        if (!point.location) {
          return;
        }
        return (
          <PickupMarker
            key={key}
            pickupId={key}
            rideId={props.rideId}
            location={point.location}
          />
        );
      })}
    </>
  );
};

const PickupMarker = ({
  location,
  pickupId,
  rideId,
}: {
  location: { lat: number; lng: number };
  pickupId: string;
  rideId: string;
}) => {
  const [address, setAddress] = useState<Geocode | undefined>(undefined);
  const [pickup] = usePickupPoint(rideId, pickupId);
  const [members, setMembers] = useState<User[]>();
  const [user] = useAuthState(auth);
  const [startDate] = useRideStartDate(rideId);
  const [pickupTime, setPickupTime] = useState<Date>();
  const [pickupRoute] = usePickupPointRoute(rideId, pickupId);

  const getLocation = React.useCallback(
    (location) => getReverseGeocode(new LatLng(location.lat, location.lng)),
    [location]
  );

  React.useEffect(() => {
    getLocation(location).then(setAddress);
  }, [location]);

  useEffect(() => {
    if (!pickup?.members) setMembers(undefined);
    else {
      const userPromises = Object.keys(pickup.members).map((userId) => {
        return getUser(userId);
      });
      Promise.all(userPromises).then((users) => setMembers(users));
    }
  }, [pickup]);
  const inPickup =
    user?.uid && pickup?.members ? pickup.members[user.uid] : false;

  useEffect(() => {
    if (startDate && pickupRoute) {
      const pDate = new Date(startDate);
      pDate.setTime(pDate.getTime() + pickupRoute.duration * 1000);
      setPickupTime(pDate);
    }
  }, [startDate, pickupRoute]);

  const icon = divIcon({
    className: "",
    iconSize: [48, 48],
    html: ReactDOMServer.renderToString(
      <SVGPickupIcon
        time={
          pickupTime?.toLocaleTimeString("en", { timeStyle: "short" }) ?? ""
        }
      />
    ),
  });

  if (!pickup) return <></>;
  return (
    <Marker position={pickup.location} icon={icon}>
      <Popup>
        <Heading size={"sm"}>
          {address
            ? `${address.street}, ${address.adminArea5}`
            : `${location.lat}, ${location.lng}`}
        </Heading>
        {members?.map((member: User, i: number) => (
          <Heading size={"xs"} key={i} pt={2} pb={2}>
            {member.name}
          </Heading>
        ))}
        <Button
          onClick={() => {
            if (user?.uid) {
              clearUserFromPickups(rideId, user.uid);
              setUserInPickup(rideId, pickupId, user.uid, !inPickup);
              setRidePassenger(user.uid, rideId, !inPickup);
            }
          }}
        >
          {inPickup ? "Leave" : "Join"}
        </Button>
      </Popup>
    </Marker>
  );
};

export default PickupMarkers;

const SVGPickupIcon = ({ time }: { time: string }) => (
  <svg
    width={64}
    height={48}
    viewBox="0 0 64 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx={32}
      cy={20}
      r={19}
      fill="white"
      stroke="black"
      strokeWidth={2}
    />
    <rect
      x={1}
      y={29}
      width={62}
      height={18}
      rx={3}
      fill={lightTheme.form}
      stroke="black"
      strokeWidth={2}
    />
    <circle cx={32} cy={20} r={18} fill={lightTheme.form} />
    <path
      d="M21.5625 26.875C21.5625 26.875 20 26.875 20 25.3125C20 23.75 21.5625 19.0625 29.375 19.0625C37.1875 19.0625 38.75 23.75 38.75 25.3125C38.75 26.875 37.1875 26.875 37.1875 26.875H21.5625ZM29.375 17.5C30.6182 17.5 31.8105 17.0061 32.6896 16.1271C33.5686 15.248 34.0625 14.0557 34.0625 12.8125C34.0625 11.5693 33.5686 10.377 32.6896 9.49794C31.8105 8.61886 30.6182 8.125 29.375 8.125C28.1318 8.125 26.9395 8.61886 26.0604 9.49794C25.1814 10.377 24.6875 11.5693 24.6875 12.8125C24.6875 14.0557 25.1814 15.248 26.0604 16.1271C26.9395 17.0061 28.1318 17.5 29.375 17.5V17.5Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M41.0938 12.8125C41.301 12.8125 41.4997 12.8948 41.6462 13.0413C41.7927 13.1878 41.875 13.3865 41.875 13.5938V15.9375H44.2188C44.426 15.9375 44.6247 16.0198 44.7712 16.1663C44.9177 16.3128 45 16.5115 45 16.7188C45 16.926 44.9177 17.1247 44.7712 17.2712C44.6247 17.4177 44.426 17.5 44.2188 17.5H41.875V19.8438C41.875 20.051 41.7927 20.2497 41.6462 20.3962C41.4997 20.5427 41.301 20.625 41.0938 20.625C40.8865 20.625 40.6878 20.5427 40.5413 20.3962C40.3948 20.2497 40.3125 20.051 40.3125 19.8438V17.5H37.9688C37.7615 17.5 37.5628 17.4177 37.4163 17.2712C37.2698 17.1247 37.1875 16.926 37.1875 16.7188C37.1875 16.5115 37.2698 16.3128 37.4163 16.1663C37.5628 16.0198 37.7615 15.9375 37.9688 15.9375H40.3125V13.5938C40.3125 13.3865 40.3948 13.1878 40.5413 13.0413C40.6878 12.8948 40.8865 12.8125 41.0938 12.8125Z"
      fill="black"
    />
    <text x={4} y={42} textLength={56} fill="black">
      {time}
    </text>
  </svg>
);
