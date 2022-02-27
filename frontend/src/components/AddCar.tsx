import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Box, Stack } from "@chakra-ui/layout";
import {
  Button,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";

interface Vehicle {
  type: string;
  fuelUsage: number;
}

const cars: Vehicle[] = [
  { type: "Two-seater", fuelUsage: 10 },
  { type: "Minicompact", fuelUsage: 7 },
  { type: "Subcompact", fuelUsage: 8 },
  { type: "Compact", fuelUsage: 8.2 },
  { type: "Mid-size", fuelUsage: 8.5 },
  { type: "Full-Sized", fuelUsage: 9 },
  { type: "Station-Wagon", fuelUsage: 10 },
  { type: "Electric", fuelUsage: 5 },
];

const trucks: Vehicle[] = [
  { type: "Small Pickup", fuelUsage: 11.5 },
  { type: "Standard Pickup", fuelUsage: 13 },
  { type: "Minivan", fuelUsage: 12 },
  { type: "Van", fuelUsage: 13 },
  { type: "Extra Large", fuelUsage: 15 },
];

const AddCar = () => {
  const [userModalOpen, setUserModalOpen] = useState(false);
  return (
    <MenuItem onClick={() => setUserModalOpen(true)}>
      Add A Car
      {
        <Modal
          isOpen={userModalOpen}
          onClose={() => setUserModalOpen(false)}
          isCentered={true}
        >
          <ModalContent h={"container.sm"} padding={"4"} w={"95%"}>
            <ModalHeader>Add A Car</ModalHeader>
            <ModalBody>
              <CarSelector />
              <Button alignContent="end"> Add </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      }
    </MenuItem>
  );
};

const CarSelector = () => {
  const [selection, setSelection] = useState("1");
  return (
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
          <RadioGroup onChange={setSelection} value={selection}>
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
          <RadioGroup onChange={setSelection} value={selection}>
            <Stack direction="column">
              {trucks.map((c: Vehicle, i: number) => (
                <Radio key={i} value={`${i}`}>
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
