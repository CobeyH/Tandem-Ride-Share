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
} from "@chakra-ui/react";
import { useState } from "react";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";

const ShareLink = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState("Hello world");
  const { hasCopied, onCopy } = useClipboard(value);
  const url = window.location.href;
  return (
    <>
      <Button
        size="sm"
        rightIcon={<ExternalLinkIcon />}
        onClick={() => {
          setValue(url + "/join");
          onOpen();
        }}
        aria-label="Share group"
      >
        Share
      </Button>

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
