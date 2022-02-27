import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Box, Spacer, Stack } from "@chakra-ui/layout";
import {
  Button,
  Input,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { ref, set } from "firebase/database";
import * as React from "react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, DB_USER_COLLECT, Vehicle } from "../firebase";

const cars: Vehicle[] = [
  { type: "Two-seater", fuelUsage: 10, numSeats: 2 },
  { type: "Minicompact", fuelUsage: 7, numSeats: 4 },
  { type: "Subcompact", fuelUsage: 8, numSeats: 5 },
  { type: "Compact", fuelUsage: 8.2, numSeats: 5 },
  { type: "Mid-size", fuelUsage: 8.5, numSeats: 5 },
  { type: "Full-Sized", fuelUsage: 9, numSeats: 5 },
  { type: "Station-Wagon", fuelUsage: 10, numSeats: 5 },
  { type: "Electric", fuelUsage: 5, numSeats: 5 },
];

const trucks: Vehicle[] = [
  { type: "Small Pickup", fuelUsage: 11.5, numSeats: 2 },
  { type: "Standard Pickup", fuelUsage: 13, numSeats: 4 },
  { type: "Minivan", fuelUsage: 12, numSeats: 7 },
  { type: "Van", fuelUsage: 13, numSeats: 7 },
  { type: "Extra Large", fuelUsage: 15, numSeats: 7 },
];

const AddCar = (props: { user: User }) => {
  const [carModalOpen, setCarModalOpen] = useState(false);
  return (
    <MenuItem onClick={() => setCarModalOpen(true)}>
      Add A Car
      {
        <Modal
          isOpen={carModalOpen}
          onClose={() => setCarModalOpen(false)}
          isCentered={true}
        >
          <ModalContent h={"container.sm"} padding={"4"} w={"95%"}>
            <ModalHeader>Add A Car</ModalHeader>
            <CarSelector />
          </ModalContent>
        </Modal>
      }
    </MenuItem>
  );
};

const registerCar = async (car: Vehicle) => {
  const [user] = useAuthState(auth);
  const carId = car.displayName?.replace(/\s+/g, "-").toLowerCase();
  //TODO: User feedback on error states
  if (!user || !carId) {
    return;
  }
  await set(ref(db, `${DB_USER_COLLECT}/${user?.uid}/vehicles/${carId}`), car);
};

const getCarFromList = (radioIndex: string): Vehicle => {
  const index = parseInt(radioIndex);
  return index < cars.length ? cars[index] : trucks[index - cars.length];
};

const CarSelector = () => {
  const [displayName, setDisplayName] = useState("");
  const [carType, setcarType] = useState("1");
  const [car, setCar] = useState<Vehicle>(cars[0]);
  const [numSeats, setNumSeats] = useState<number>(0);
  const [fuelUsage, setFuelUsage] = useState<number>(0);

  useEffect(() => {
    setCar(getCarFromList(carType));
    setNumSeats(car.numSeats);
    setFuelUsage(car.fuelUsage);
  }, [carType]);
  return (
    <ModalBody>
      <h2>Display Name</h2>
      <Input
        isRequired={true}
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

      <Accordion>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Car
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <RadioGroup onChange={setcarType} value={carType}>
              <Stack direction="column">
                {cars.map((c: Vehicle, i: number) => (
                  <Radio key={i} value={`${i}`}>
                    {c.type}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Truck
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <RadioGroup onChange={setcarType} value={carType}>
              <Stack direction="column">
                {trucks.map((c: Vehicle, i: number) => (
                  <Radio key={cars.length + i} value={`${cars.length + i}`}>
                    {c.type}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <h2>Number of Seats</h2>
      <NumberInput
        onChange={(value) => setNumSeats(parseInt(value))}
        value={numSeats}
        min={1}
        max={12}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <h2>Fuel Usage</h2>
      <NumberInput
        onChange={(value) => setFuelUsage(parseFloat(value))}
        value={fuelUsage}
        min={5}
        max={20}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Spacer pt={5} />
      <Button
        onClick={() => {
          registerCar({
            type: car.type,
            numSeats,
            fuelUsage,
            displayName,
          }).then(() => alert("car registered"));
        }}
      >
        Add
      </Button>
    </ModalBody>
  );
};

export default AddCar;
