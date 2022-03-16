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
  useToast,
  Text,
  Heading,
} from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
import { Group, setGroup } from "../../firebase/database";
import PriceSelector, { PlanTypes } from "../Promotional/PriceSelector";

const GroupSettings = ({ group }: { group: Group }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [plan, setPlan] = useState<PlanTypes>(group.plan);
  const toast = useToast();

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
            <Heading size={"s"} mb={4}>
              Group Size
            </Heading>
            <PriceSelector showSelectors={true} updateGroupPlan={setPlan} />
            <Heading size={"s"} mt={4} mb={4}>
              Publicity
            </Heading>
            <Text>
              Your group is currently{" "}
              <b>{group.isPrivate ? "private" : "public"}</b> this means{" "}
              {group.isPrivate
                ? "no one can join without a link"
                : "anyone can join"}
              .
            </Text>
            <Button
              mt={4}
              mb={4}
              size={"sm"}
              onClick={() =>
                setGroup({ ...group, isPrivate: !group.isPrivate }).then(
                  (group) => {
                    if (group.isPrivate) {
                      toast({
                        title: `${group.name} is now Private`,
                        status: "info",
                        description:
                          "Only people who have been sent a link to your group can join it.",
                      });
                    } else {
                      toast({
                        title: `${group.name} is now public`,
                        status: "warning",
                        description: `Anyone can join ${group.name} and it is publicly discoverable.`,
                      });
                    }
                  }
                )
              }
            >
              Make {group.isPrivate ? "Public" : "Private"}
            </Button>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onClose();
                setGroup({ ...group, plan });
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
