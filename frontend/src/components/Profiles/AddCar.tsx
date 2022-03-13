import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Flex, Heading, Spacer, Stack } from "@chakra-ui/layout";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import {
  Button,
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

const AddCar = (props: { user: User }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <MenuItem onClick={onOpen}>
      Add A Car
      {
        <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
          <ModalContent h={"container.sm"} padding={"4"} w={"95%"}>
            <ModalCloseButton />
            <ModalHeader>Add A Car</ModalHeader>
            <CarSelector user={props.user} onDone={onClose} />
          </ModalContent>
        </Modal>
      }
    </MenuItem>
  );
};

const registerCar = async (user: User, car: Vehicle) => {
  if (!user || !car.displayName) {
    return;
  }
  car.carId = car.displayName?.replace(/\s+/g, "-").toLowerCase();
  //TODO: User feedback on error states
  await setUserVehicle(user.uid, car);
};

const getCarFromList = (radioIndex: string): Vehicle => {
  const index = parseInt(radioIndex);
  return index < cars.length ? cars[index] : trucks[index - cars.length];
};

const steps = [
  {
    label: "Name",
    content: <Button />,
  },
  {
    label: "Type",
    content: <Button> 2</Button>,
  },
  {
    label: "Configure",
    content: <Button> 3</Button>,
  },
];

const CarSelector = (props: { user: User; onDone?: () => void }) => {
  const [displayName, setDisplayName] = useState("");
  const [car, setCar] = useState<Vehicle>(cars[0]);
  const toast = useToast();
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
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
        <Step label="Name Your Car">
          <Input
            isRequired={true}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Text textAlign={"left"}>
            The name will be used to identify your car when you join a ride.
          </Text>
        </Step>
        <Step label="Choose Car Type">
          <CarAccordion carUpdate={setCar} />
        </Step>
        <Step label="Configure">
          <CarStatsSlider car={car} updateCar={setCar} />
        </Step>
      </Steps>
      {activeStep === steps.length ? (
        <Flex p={4}>
          <Button mx="auto" size="sm" onClick={reset}>
            Reset
          </Button>
          <Button mx="auto" size="sm" onClick={submitCar}>
            Submit
          </Button>
        </Flex>
      ) : (
        <Flex width="100%" justify="flex-end">
          <Button
            isDisabled={activeStep === 0}
            mr={4}
            onClick={prevStep}
            size="sm"
            variant="ghost"
          >
            Prev
          </Button>
          <Button
            size="sm"
            onClick={nextStep}
            isDisabled={activeStep === 0 && !displayName}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Flex>
      )}
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
