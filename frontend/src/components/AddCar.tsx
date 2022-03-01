import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Heading, Spacer, Stack } from "@chakra-ui/layout";
import {
  Button,
  Input,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { ref, set } from "firebase/database";
import * as React from "react";
import { useState } from "react";
import { db, DB_USER_COLLECT, Vehicle } from "../firebase";
import CarStatsSlider from "./CarStatsSlider";

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
            <CarSelector user={props.user} />
          </ModalContent>
        </Modal>
      }
    </MenuItem>
  );
};

const registerCar = async (user: User, car: Vehicle) => {
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

const CarSelector = (props: { user: User }) => {
  const [displayName, setDisplayName] = useState("");
  const [car, setCar] = useState<Vehicle>(cars[0]);

  return (
    <ModalBody>
      <Heading as="h2" size="l">
        Display Name
      </Heading>
      <Input
        isRequired={true}
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <CarAccordion carUpdate={setCar} />
      <CarStatsSlider car={car} updateCar={setCar} />
      <Spacer pt={5} />
      <Button
        onClick={() => {
          registerCar(props.user, {
            ...car,
            displayName,
          }).then(() => alert("car registered"));
        }}
      >
        Add
      </Button>
    </ModalBody>
  );
};

const CarAccordion = (props: { carUpdate: (carType: Vehicle) => void }) => {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Heading as="h2" size="l">
              Car
            </Heading>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <RadioGroup
            onChange={(carType: string) =>
              props.carUpdate(getCarFromList(carType))
            }
          >
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
            <Heading as="h2" size="l">
              Truck
            </Heading>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <RadioGroup
            onChange={(carType: string) =>
              props.carUpdate(getCarFromList(carType))
            }
          >
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
  );
};

export default AddCar;
