import React, { useState, useRef } from "react";
import {
  Button,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  useToast,
  Input,
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
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import ChooseCar from "../Rides/ChooseCar";
import CarStatsSlider from "./CarStatsSlider";
import {
  setUserVehicle,
  Vehicle,
  useUserVehicles,
  deleteUserVehicle,
} from "../../firebase/database";

const ManageCars = (props: { user: User }) => {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Vehicle>();
  const user = props.user;
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newName, setNewName] = useState<string | undefined>();
  const userVehicles = useUserVehicles(user.uid)[0];
  const cancelRef = useRef<HTMLButtonElement>(null);

  const modifyCar = async (user: User, car: Vehicle | undefined) => {
    if (!user || !car?.displayName) {
      return;
    }
    const newCar = { ...car, displayName: newName };
    await setUserVehicle(user.uid, newCar).then(() => {
      toast({
        title: "Car Updated",
        description: `We've changed information of ${newName}`,
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
                <HStack spacing={2} mt={3}>
                  <Spacer />
                  <Button
                    onClick={() => {
                      setUserModalOpen(false);
                      modifyCar(user, selectedCar);
                    }}
                  >
                    Save
                  </Button>
                  <Button variant={"tandem-warning"} onClick={onOpen}>
                    Delete
                  </Button>
                </HStack>
              </>
            ) : null}
          </ModalBody>
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete car
                </AlertDialogHeader>

                <AlertDialogBody>Are you sure?</AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant={"tandem-warning"}
                    onClick={() => {
                      onClose();
                      deleteCar(user, selectedCar);
                      setUserModalOpen(false);
                    }}
                    ml={3}
                  >
                    Confirm
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </ModalContent>
      </Modal>
    </MenuItem>
  );
};

export default ManageCars;
