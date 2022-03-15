import { Menu, Select, Spinner } from "@chakra-ui/react";
import * as React from "react";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useUserVehicles, Vehicle } from "../../firebase/database";
import { auth } from "../../firebase/firebase";
import AddCar from "../Profiles/AddCar";

const ChooseCar = (props: {
  carUpdate: (car: Vehicle | undefined) => void;
  carId?: string;
}) => {
  const [user] = useAuthState(auth);
  const [cars, loadingCars] = useUserVehicles(user?.uid);
  if (!user) return null;

  useEffect(() => {
    if (cars && cars.length > 0 && !props.carId) {
      props.carUpdate(cars[0]);
    }
  }, [loadingCars, cars]);

  return loadingCars ? (
    <Spinner />
  ) : !cars || cars.length == 0 ? (
    <Menu>
      <AddCar user={user} />
    </Menu>
  ) : (
    <Select
      value={props.carId}
      onChange={(e) => {
        if (!e.target.value) {
          return;
        }
        props.carUpdate(cars.find((v: Vehicle) => v.carId === e.target.value));
      }}
    >
      {cars?.map((v: Vehicle) => (
        <option key={v.carId} value={v.carId}>
          {v.displayName}
        </option>
      ))}
    </Select>
  );
};

export default ChooseCar;
