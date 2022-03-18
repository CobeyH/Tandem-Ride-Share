import React, { useState } from "react";
import {
  Button,
  Flex,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useToast,
  Input,
  DrawerFooter,
  Box,
  HStack,
  useDisclosure,
  Spacer,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Heading,
  Select,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { MdEmail } from "react-icons/all";
import { User } from "firebase/auth";
import ChooseCar from "../Rides/ChooseCar";
import CarStatsSlider from "./CarStatsSlider";
import VerifiedStep from "../VerifiedStep";
import {
  setUserVehicle,
  Vehicle,
  useUserVehicles,
  deleteUserVehicle,
  useUserVehicle,
} from "../../firebase/database";

const cars: Vehicle[] = [
  { type: "Two-seater", fuelUsage: 10, numSeats: 2 },
  { type: "Subcompact", fuelUsage: 8, numSeats: 5 },
  { type: "Compact", fuelUsage: 8.2, numSeats: 5 },
  { type: "Mid-size", fuelUsage: 8.5, numSeats: 5 },
  { type: "Station-Wagon", fuelUsage: 10, numSeats: 5 },
  { type: "Electric", fuelUsage: 5, numSeats: 5 },
];

const ManageCars = (props: { user: User }) => {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Vehicle>();
  const [car, setCar] = useState<Vehicle>(cars[0]);
  const user = props.user;
  const toast = useToast();
  const [displayName, setDisplayName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newName, setNewName] = useState<string | undefined>();

  const userVehicles = useUserVehicles(user.uid)[0];

  const modifyCar = async (user: User, car: Vehicle | undefined) => {
    if (!user || !car?.displayName) {
      return;
    }
    const newCar = { ...car, displayName: newName };
    await setUserVehicle(user.uid, newCar).then(() => {
      toast({
        title: "Car Information modified",
        description: `We've changed information of ${car.displayName}`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    });
  };

  const deleteCar = async (user: User, car: Vehicle | undefined) => {
    if (!user || !car?.displayName) {
      return;
    }
    alert(`Delete ${car?.displayName}?`);
    await deleteUserVehicle(user.uid, car).then(() => {
      toast({
        title: "Car Deleted",
        description: `We've deleted ${car.displayName}`,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    });
  };

  return (
    <MenuItem onClick={() => setUserModalOpen(true)}>
      Manage Cars
      <Modal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        isCentered={true}
      >
        <ModalContent h={"container.xs"} padding={"4"} w={"95%"}>
          <ModalCloseButton />
          <ModalHeader>Manage Cars</ModalHeader>
          <ModalBody>
            {userVehicles != undefined && userVehicles.length > 0 ? (
              <Heading as="h2" size="l">
                Choose a Car
              </Heading>
            ) : null}
            {/*<Select*/}
            {/*  placeholder="Select option"*/}
            {/*  onChange={(e) => {*/}
            {/*    console.log(e.target.value);*/}
            {/*    setSelectedCar(useUserVehicle(user.uid, e.target.value));*/}
            {/*  }}*/}
            {/*>*/}
            {/*  {userVehicles?.map((v: Vehicle) => (*/}
            {/*    <option key={v.carId} value={v.carId}>*/}
            {/*      {v.displayName}*/}
            {/*    </option>*/}
            {/*  ))}*/}
            {/*</Select>*/}
            <ChooseCar
              carUpdate={(car) => {
                setSelectedCar(car);
                setNewName(car?.displayName);
              }}
            />
            {selectedCar &&
            userVehicles != undefined &&
            userVehicles.length > 0 ? (
              <>
                <Heading as="h2" size="l" mt={2}>
                  Name
                </Heading>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <CarStatsSlider
                  car={selectedCar}
                  updateCar={setSelectedCar}
                  isDisabled={false}
                />
                <HStack spacing={2} mt={2}>
                  <Spacer />
                  <Button onClick={() => modifyCar(user, selectedCar)}>
                    Save
                  </Button>
                  <Button
                    variant={"tandem-warning"}
                    onClick={() => deleteCar(user, selectedCar)}
                  >
                    Delete
                  </Button>
                </HStack>
              </>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setUserModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MenuItem>
  );
};

export default ManageCars;
