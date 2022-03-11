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

const GroupSettings = (props: { group: Group }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [maxSize, setSize] = useState<number>(props.group.maxSize);
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
        {" "}
        Settings{" "}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <GroupSizeSlider
              maxSize={maxSize}
              isPrivate={props.group.isPrivate}
              setSize={setSize}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onClose();
                setGroup({ ...props.group, maxSize });
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
