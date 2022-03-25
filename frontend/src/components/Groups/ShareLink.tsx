import * as React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useClipboard,
  Input,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { User } from "firebase/auth";
import { AiOutlineShareAlt } from "react-icons/ai";

const ShareLink = (props: { user: User | null | undefined }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState("");
  const context = `${props.user?.displayName} invited you to join their Tandem group! Follow the link to join the group: \n`;
  const { hasCopied, onCopy } = useClipboard(context + value);
  const url = window.location.href;
  return (
    <>
      <IconButton
        size="sm"
        icon={<AiOutlineShareAlt />}
        bg="transparent"
        fontSize="30px"
        isRound
        onClick={() => {
          setValue(url + "/join");
          onOpen();
        }}
        aria-label="Share group"
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Copy Invite Link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mb={2}>
              <Input value={value} isReadOnly placeholder="Welcome" />
              <Button onClick={onCopy} ml={2}>
                {hasCopied ? <CheckIcon /> : <CopyIcon />}
              </Button>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShareLink;
