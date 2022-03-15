import { IoMdSettings } from "react-icons/all";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
} from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
import GroupSizeSlider from "./GroupSizeSlider";
import { Group, setGroup } from "../firebase/database";
import PriceSelector, {
  groupMaxSize,
  PlanTypes,
} from "./Promotional/PriceSelector";

const GroupSettings = (props: { group: Group }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [plan, setPlan] = useState<PlanTypes>(props.group.plan);
  return (
    <>
      <Button
        size="sm"
        rightIcon={<IoMdSettings />}
        onClick={() => {
          onOpen();
        }}
        aria-label="Share group"
      >
        Settings
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PriceSelector showSelectors={true} updateGroupPlan={setPlan} />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onClose();
                setGroup({ ...props.group, plan });
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupSettings;
