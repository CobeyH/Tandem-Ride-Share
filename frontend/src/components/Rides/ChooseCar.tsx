import { Menu, Select, Spinner } from "@chakra-ui/react";
import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useUserVehicles, Vehicle } from "../../firebase/database";
import { auth } from "../../firebase/firebase";
import AddCar from "../Profiles/AddCar";

const ChooseCar = (props: {
  carUpdate: (car: Vehicle) => void;
  carId?: string;
}) => {
  const [user] = useAuthState(auth);
  const [cars, loadingCars] = useUserVehicles(user?.uid);
  if (!user) return null;

  return loadingCars ? (
    <Spinner />
  ) : !cars || cars.length == 0 ? (
    <Menu>
      <AddCar user={user} />
    </Menu>
  ) : (
    <Select
      onChange={(e) => {
        if (!e.target.value || !cars) {
          return;
        }
        props.carUpdate(cars[parseInt(e.target.value)]);
      }}
    >
      {cars?.map((v: Vehicle, i: number) => (
        <option key={i} value={i} selected={v.carId === props.carId}>
          {v.displayName}
        </option>
      ))}
    </Select>
  );
};

export default ChooseCar;
