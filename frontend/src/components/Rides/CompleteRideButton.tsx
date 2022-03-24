import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { completeRide } from "../../firebase/database";
import { styleColors } from "../../theme/colours";

const CompleteRideButton = ({ rideId }: { rideId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button width="full" onClick={onOpen}>
        Ride Completed
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Complete Ride
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to complete this ride? <br /> You cannot
              undo this action.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                bg={styleColors.medGreen}
                onClick={() => {
                  onClose();
                  completeRide(rideId);
                }}
                ml={3}
              >
                Complete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CompleteRideButton;
