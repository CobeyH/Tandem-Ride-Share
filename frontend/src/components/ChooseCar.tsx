import { Select, Spinner } from "@chakra-ui/react";
import { ref } from "firebase/database";
import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useListVals } from "react-firebase-hooks/database";
import { Vehicle } from "../firebase/database";
import { auth, db } from "../firebase/firebase";

const ChooseCar = (props: { carUpdate: (car: Vehicle) => void }) => {
  const [user] = useAuthState(auth);
  const [cars, loadingCars] = useListVals<Vehicle>(
    ref(db, `users/${user?.uid}/vehicles`),
    { keyField: "carId" }
  );
  return loadingCars ? (
    <Spinner />
  ) : (
    <Select
      placeholder="Select Car"
      onChange={(e) => {
        if (!e.target.value || !cars) {
          return;
        }
        props.carUpdate(cars[parseInt(e.target.value)]);
      }}
    >
      {cars?.map((v: Vehicle, i: number) => (
        <option key={i} value={i}>
          {v.displayName}
        </option>
      ))}
    </Select>
  );
};

export default ChooseCar;
