import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Heading, Spacer, Stack } from "@chakra-ui/layout";
import { Steps, useSteps } from "chakra-ui-steps";
import {
  Input,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
  useToast,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import * as React from "react";
import { useState } from "react";
import { setUserVehicle, Vehicle } from "../../firebase/database";
import CarStatsSlider from "./CarStatsSlider";
import { FaCarSide, FaClipboard, FaWrench } from "react-icons/all";
import Tutorial from "../Tutorial";
import VerifiedStep from "../VerifiedStep";
const cars: Vehicle[] = [
  { type: "Two-seater", fuelUsage: 10, numSeats: 2 },
  { type: "Subcompact", fuelUsage: 8, numSeats: 5 },
  { type: "Compact", fuelUsage: 8.2, numSeats: 5 },
  { type: "Mid-size", fuelUsage: 8.5, numSeats: 5 },
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

const tutorialSteps = [
  {
    target: "#header",
    content:
      "You are about to add a car to your profile. When you create or join a ride you can select from the cars on your profile.",
    disableBeacon: true,
  },
  {
    target: "#name-car",
    content: "The car name will be used to identify it from your list of cars",
  },
  {
    target: "#car-type",
    content:
      "The type of car is used to estimate the number of seats and fuel usage of your car for you. You can fine tune it in the next step.",
  },
  {
    target: "#configure",
    content:
      "In the final step you can change your number of seats and specify your fuel usage in L/100Km. This will be used when you join a ride to determine fuel cost and number of passengers.",
  },
];

interface AddCarProps {
  modalProps: { isOpen: boolean; onClose(): void };
  user: User;
}

export const AddCarModal = (props: AddCarProps) => {
  return (
    <Modal
      isOpen={props.modalProps.isOpen}
      onClose={props.modalProps.onClose}
      isCentered={true}
    >
      <ModalContent h={"container.sm"} padding={"4"} w={"95%"}>
        <ModalCloseButton />
        <ModalHeader id="header">
          Add A Car
          <Tutorial steps={tutorialSteps} />
        </ModalHeader>
        <CarSelector user={props.user} onDone={props.modalProps.onClose} />
      </ModalContent>
    </Modal>
  );
};

const AddCar = (props: { user: User }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <MenuItem onClick={onOpen}>Add A Car</MenuItem>
      <AddCarModal user={props.user} modalProps={{ isOpen, onClose }} />
    </>
  );
};

const registerCar = async (user: User, car: Vehicle) => {
  if (!user || !car.displayName) {
    return;
  }
  //car.carId = car.displayName?.replace(/\s+/g, "-").toLowerCase();
  car.carId = Date.now().valueOf().toString();
  //TODO: User feedback on error states
  await setUserVehicle(user.uid, car);
};

const getCarFromList = (radioIndex: string): Vehicle => {
  const index = parseInt(radioIndex);
  return index < cars.length ? cars[index] : trucks[index - cars.length];
};

const CarSelector = (props: { user: User; onDone?: () => void }) => {
  const [displayName, setDisplayName] = useState("");
  const [car, setCar] = useState<Vehicle>(cars[0]);
  const toast = useToast();
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const submitCar = () => {
    registerCar(props.user, {
      ...car,
      displayName,
    }).then(() => {
      toast({
        title: "Car created",
        description: `We've created a car with ${car.numSeats} seats.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      if (props.onDone) {
        props.onDone();
      }
    });
  };

  return (
    <ModalBody>
      <Steps activeStep={activeStep} orientation="vertical">
        <VerifiedStep
          isFirstStep={true}
          nextStep={nextStep}
          prevStep={prevStep}
          isVerified={(displayName) => displayName.length !== 0}
          currentInput={displayName}
          label="Name Your Car"
          icon={FaClipboard}
          id="name-car"
        >
          <Input
            isRequired={true}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Text textAlign={"left"} variant="help-text">
            The name will be used to identify your car when you join a ride.
          </Text>
        </VerifiedStep>
        <VerifiedStep
          label="Choose Car Type"
          icon={FaCarSide}
          id="car-type"
          nextStep={nextStep}
          prevStep={prevStep}
          currentInput={car}
        >
          <CarAccordion carUpdate={setCar} />
        </VerifiedStep>
        <VerifiedStep
          label="Configure"
          icon={FaWrench}
          id="configure"
          currentInput={car}
          prevStep={prevStep}
          nextStep={submitCar}
          isLastStep={true}
        >
          <CarStatsSlider car={car} updateCar={setCar} />
        </VerifiedStep>
      </Steps>
      <Spacer pt={5} />
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
