import React, { useState } from "react";
import {
  Flex,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { MdEmail } from "react-icons/all";
import { User } from "firebase/auth";
import ChooseCar from "../Rides/ChooseCar";
import CarStatsSlider from "./CarStatsSlider";
import VerifiedStep from "../VerifiedStep";
import { Vehicle } from "../../firebase/database";

const ManageCars = (props: { user: User }) => {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Vehicle | undefined>(
    undefined
  );
  const user = props.user;
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
            <ChooseCar
              carUpdate={(car) => {
                setSelectedCar(car);
              }}
            />
            {selectedCar ? (
              <CarStatsSlider
                car={selectedCar}
                updateCar={setSelectedCar}
                isDisabled={true}
              />
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </MenuItem>
  );
};

export default ManageCars;
