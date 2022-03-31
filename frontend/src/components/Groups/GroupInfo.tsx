import { FaInfo } from "react-icons/fa";
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
  Icon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  HStack,
  ButtonProps,
} from "@chakra-ui/react";
import * as React from "react";
import { useMemo, useRef, useState } from "react";
import { Group, removeUserFromGroup, setGroup } from "../../firebase/database";
import PriceSelector, {
  groupMaxSize,
  PlanTypes,
} from "../Promotional/PriceSelector";
import { useNavigate } from "react-router-dom";
import { FaWalking } from "react-icons/all";
import GroupMembersList from "./GroupMembersList";

function Publicity({ group }: { group: Group }) {
  const toast = useToast();

  return (
    <>
      <Heading size={"s"} my={4}>
        Publicity
      </Heading>
      <Text>
        Your group is currently <b>{group.isPrivate ? "private" : "public"}</b>{" "}
        this means{" "}
        {group.isPrivate ? "no one can join without a link" : "anyone can join"}
        .
      </Text>
      <Button
        mt={4}
        mb={4}
        size={"sm"}
        onClick={() =>
          setGroup({ ...group, isPrivate: !group.isPrivate }).then((group) => {
            if (group.isPrivate) {
              toast({
                title: `${group.name} is now Private`,
                status: "info",
                description:
                  "Only people who have been sent a link to your group can join it.",
                isClosable: true,
              });
            } else {
              toast({
                title: `${group.name} is now public`,
                status: "warning",
                description: `Anyone can join ${group.name} and it is publicly discoverable.`,
                isClosable: true,
              });
            }
          })
        }
      >
        Make {group.isPrivate ? "Public" : "Private"}
      </Button>
    </>
  );
}

const GroupInfo = ({ group, userId }: { group: Group; userId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [plan, setPlan] = useState<PlanTypes>(group.plan);

  const isOwner = group.owner === userId;

  const maxSize = useMemo(() => groupMaxSize(group.plan), [group.plan]);

  return (
    <>
      <Button
        size="sm"
        rightIcon={<FaInfo />}
        onClick={() => {
          onOpen();
        }}
        aria-label="Share group"
      >
        Info
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={{ base: "90%", md: "70%", lg: "40%" }} p={15}>
          <ModalHeader>{isOwner ? "Group Settings" : "Group Info"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isOwner ? (
              <>
                <PriceSelector showSelectors={true} updateGroupPlan={setPlan} />{" "}
                {/*todo - make this less aggressive*/}
                <Publicity group={group} />
              </>
            ) : null}
            <HStack>
              <Heading my={4} size={"s"}>
                Members
              </Heading>{" "}
              <Text>
                {Object.keys(group.members).length} / {maxSize}
              </Text>
            </HStack>
            <GroupMembersList
              members={group.members}
              ownerId={group.owner}
              maxSize={maxSize}
              groupId={group.id}
              isOpen={true}
            />
            {!isOwner ? (
              <LeaveGroupButton
                groupId={group.id}
                userId={userId}
                buttonProps={{ mt: 4 }}
              />
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                onClose();
                setGroup({ ...group, plan });
              }}
            >
              {group.plan === plan ? Close : Save}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

function LeaveGroupButton({
  groupId,
  userId,
  buttonProps,
}: {
  userId: string;
  groupId: string;
  buttonProps?: ButtonProps;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <Button
        size="sm"
        rightIcon={<Icon as={FaWalking} />}
        onClick={onOpen}
        {...buttonProps}
      >
        Leave Group{" "}
      </Button>
      <AlertDialog
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Leave Group
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                bg={"red.300"}
                onClick={() => {
                  removeUserFromGroup(userId, groupId).then(() =>
                    navigate("/")
                  );
                  onClose();
                }}
                ml={3}
              >
                Leave
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default GroupInfo;
