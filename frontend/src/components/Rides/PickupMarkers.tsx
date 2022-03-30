import { Button, Heading } from "@chakra-ui/react";
import { Marker, Popup } from "react-leaflet";
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import {
  clearUserFromPickups,
  getUser,
  Ride,
  Route,
  setRidePassenger,
  setUserInPickup,
  User,
  useRide,
  useRoute,
} from "../../firebase/database";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import { divIcon, latLng, LatLng } from "leaflet";
import { styleColors } from "../../theme/colours";

const timeFmt: Intl.DateTimeFormatOptions = { timeStyle: "short" };
const addSecToDate = (dateString: string, seconds: number) => {
  const date = new Date(dateString);
  date.setTime(date.getTime() + seconds * 1000);
  return date;
};

const validateRideRoute = (ride: Ride, route: Route) => {
  if (!ride.startDate) return false;
  if (!ride.start || !Object.keys(ride.pickupPoints).includes(ride.start)) {
    return false;
  }
  if (!Object.keys(route.points).includes("end")) return false;
  return true;
};

const RideMarkers = ({ rideId }: { rideId: string }) => {
  const [ride] = useRide(rideId);
  const [route] = useRoute(rideId);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setValid(ride && route ? validateRideRoute(ride, route) : false);
  }, [ride, route]);

  return valid && ride && route ? (
    <>
      {Object.keys(ride.pickupPoints).map((key) => {
        const isStart = ride.start === key;
        const val = ride.pickupPoints[key];
        if (!val.location) return;
        return (
          <RideMarker
            key={key}
            label={addSecToDate(
              ride.startDate,
              isStart ? 0 : route.points[key]?.duration ?? 0
            ).toLocaleTimeString("en", timeFmt)}
            purpose={isStart ? MarkerPurpose.Start : MarkerPurpose.Pickup}
            geocode={
              Object.keys(route.points).includes(key)
                ? route.points[key]?.geocode ?? ""
                : ""
            }
            location={latLng(val.location)}
            memberIds={Object.keys(val.members ?? [])}
            rideId={rideId}
            pickupId={key}
          />
        );
      })}
      <RideMarker
        label={addSecToDate(
          ride.startDate,
          route.points["end"].duration
        ).toLocaleTimeString("en", timeFmt)}
        purpose={MarkerPurpose.End}
        geocode={route.points["end"].geocode}
        location={latLng(ride.end)}
        rideId={rideId}
      />
    </>
  ) : (
    <></>
  );
};

const RideMarker = ({
  label,
  purpose,
  geocode,
  location,
  memberIds,
  rideId,
  pickupId,
}: {
  label: string;
  purpose: MarkerPurpose;
  geocode: string;
  location: LatLng;
  memberIds?: string[];
  rideId: string;
  pickupId?: string;
}) => {
  const [members, setMembers] = useState<User[]>();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!memberIds) setMembers(undefined);
    else {
      const userPromises = memberIds.map((userId) => {
        return getUser(userId);
      });
      Promise.all(userPromises).then((users) => setMembers(users));
    }
  }, [memberIds]);
  const inPickup =
    user?.uid && memberIds ? memberIds.includes(user.uid) : false;

  const icon = divIcon({
    className: "",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    html: ReactDOMServer.renderToString(
      <SVGMarkerIcon label={label} purpose={purpose} />
    ),
  });

  return (
    <Marker position={location} icon={icon}>
      <Popup offset={[9, -10]}>
        <Heading size={"sm"}>
          {geocode ? geocode : `${location.lat}, ${location.lng}`}
        </Heading>
        {members?.map((member: User, i: number) => (
          <Heading size={"xs"} key={i} pt={2} pb={2}>
            {member.name}
          </Heading>
        ))}
        <Button
          onClick={() => {
            if (pickupId && user?.uid) {
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

export default RideMarkers;

enum MarkerPurpose {
  Start,
  Pickup,
  End,
}

const markerPurposeIcon = (purpose: MarkerPurpose) => {
  switch (purpose) {
    case MarkerPurpose.Start:
      return (
        <path
          d="M21.8567 14.225L23.5063 9.51359C24.1377 7.70844 25.8406 6.5 27.7531 6.5H36.2469C38.1594 6.5 39.8609 7.70844 40.4938 9.51359L42.1437 14.225C43.2312 14.675 44 15.7484 44 17V26C44 26.8297 43.3297 27.5 42.5 27.5H41C40.1703 27.5 39.5 26.8297 39.5 26V23.75H24.5V26C24.5 26.8297 23.8283 27.5 23 27.5H21.5C20.6717 27.5 20 26.8297 20 26V17C20 15.7484 20.7669 14.675 21.8567 14.225ZM25.1141 14H38.8859L37.6625 10.5031C37.4516 9.90313 36.8844 9.5 36.2469 9.5H27.7531C27.1156 9.5 26.5484 9.90313 26.3375 10.5031L25.1141 14ZM24.5 17C23.6717 17 23 17.6703 23 18.5C23 19.3297 23.6717 20 24.5 20C25.3297 20 26 19.3297 26 18.5C26 17.6703 25.3297 17 24.5 17ZM39.5 20C40.3297 20 41 19.3297 41 18.5C41 17.6703 40.3297 17 39.5 17C38.6703 17 38 17.6703 38 18.5C38 19.3297 38.6703 20 39.5 20Z"
          fill="black"
        />
      );
    case MarkerPurpose.Pickup:
      return (
        <>
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
        </>
      );
    case MarkerPurpose.End:
      return (
        <>
          <g clipPath="url(#clip0_807_9215)">
            <path
              d="M41.2291 8.00098C40.9731 8.00098 40.7071 8.05698 40.4525 8.1771C38.6146 9.04627 37.2521 9.34127 36.115 9.34127C33.7029 9.34127 32.3012 8.01377 29.5233 8.01335C28.125 8.01335 26.3875 8.34683 24 9.34917V9.33333C24 8.59375 23.4062 8 22.6667 8C21.9271 8 21.3333 8.59375 21.3333 9.33333L21.3317 28.6667C21.3317 29.0313 21.6337 29.3333 21.9983 29.3333H23.3333C23.6979 29.3333 24 29.0333 24 28.6667V24C26.1558 23.0058 27.8629 22.6742 29.3458 22.6742C32.3079 22.6742 34.3708 23.9983 37.3333 23.9983C38.6171 23.9983 40.0696 23.7496 41.8375 23.0363C42.3458 22.8292 42.6666 22.35 42.6666 21.8375V9.28083C42.6666 8.50042 41.9916 8.00098 41.2291 8.00098ZM40 13.9083C38.6671 14.4933 37.5912 14.7662 36.6667 14.8454V18.1875C37.7266 18.126 38.8162 17.8978 40 17.465V20.8708C39.0487 21.1809 38.1696 21.3325 37.3321 21.3325C37.1051 21.3325 36.8858 21.3148 36.6667 21.2954V18.1875C36.4818 18.1982 36.2961 18.2147 36.1129 18.2147C35.0371 18.2147 34.14 18.0252 33.3333 17.7947V20.5826C32.3412 20.3303 31.2429 20.1072 30 20.0418V16.8792C29.8417 16.9042 29.6875 16.8875 29.5208 16.8875C28.7 16.8875 27.7125 17.0708 26.6667 17.3792V20.2583C25.8 20.475 24.9125 20.7417 24 21.1V18.4458L25.0321 18.0129C25.6167 17.7708 26.15 17.5792 26.6667 17.3792V13.975C25.8708 14.1875 25.0042 14.4667 24 14.8875V12.2417L25.0321 11.8088C25.6167 11.5633 26.15 11.3737 26.6667 11.2092V13.9762C27.7662 13.6865 28.7121 13.5525 29.52 13.5529C29.6897 13.5529 29.8398 13.5715 30 13.5808V10.7096C30.775 10.775 31.4333 10.9813 32.2167 11.2429C32.5708 11.3596 32.9458 11.4771 33.3333 11.5883V14.3413C34.1996 14.6263 35.0604 14.8812 36.1129 14.8812C36.2882 14.8812 36.4788 14.8614 36.6667 14.8454V11.9808C37.7266 11.9193 38.8162 11.6911 40 11.2583V13.9083ZM30 13.5792V16.9142C30.7754 16.9796 31.4321 17.186 32.2179 17.4475C32.5708 17.5667 32.9458 17.6833 33.3333 17.7958V14.3417C32.3375 14.0125 31.3167 13.6583 30 13.5792Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_807_9215">
              <rect
                width="24"
                height="21.3333"
                fill="white"
                transform="translate(20 8)"
              />
            </clipPath>
          </defs>
        </>
      );
    default:
      return <></>;
  }
};

const SVGMarkerIcon = ({
  label,
  purpose,
}: {
  label: string;
  purpose: MarkerPurpose;
}) => (
  <svg
    width={64}
    height={48}
    viewBox="0 0 64 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <style>
        @import
        url(&quot;https://fonts.googleapis.com/css2?family=Montserrat&quot;display=swap&quot;);
      </style>
    </defs>
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
      fill={styleColors.paleBlue}
      stroke="black"
      strokeWidth={2}
    />
    <circle cx={32} cy={20} r={18} fill={styleColors.paleBlue} />
    {
      /*
      Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. 
      */
      markerPurposeIcon(purpose)
    }
    <text x={4} y={42} textLength={56} fill="black" fontFamily="Montserrat">
      {label}
    </text>
  </svg>
);

/*
if (user?.uid) {
  clearUserFromPickups(rideId, user.uid);
  setUserInPickup(rideId, pickupId, user.uid, !inPickup);
  setRidePassenger(user.uid, rideId, !inPickup);
}
    <path
      d="M21.5625 26.875C21.5625 26.875 20 26.875 20 25.3125C20 23.75 21.5625 19.0625 29.375 19.0625C37.1875 19.0625 38.75 23.75 38.75 25.3125C38.75 26.875 37.1875 26.875 37.1875 26.875H21.5625ZM29.375 17.5C30.6182 17.5 31.8105 17.0061 32.6896 16.1271C33.5686 15.248 34.0625 14.0557 34.0625 12.8125C34.0625 11.5693 33.5686 10.377 32.6896 9.49794C31.8105 8.61886 30.6182 8.125 29.375 8.125C28.1318 8.125 26.9395 8.61886 26.0604 9.49794C25.1814 10.377 24.6875 11.5693 24.6875 12.8125C24.6875 14.0557 25.1814 15.248 26.0604 16.1271C26.9395 17.0061 28.1318 17.5 29.375 17.5V17.5Z"
      fill="black"
    />
*/
