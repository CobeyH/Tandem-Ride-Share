import * as React from "react";
import {
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { GiMagnifyingGlass } from "react-icons/gi";
import { Group } from "../pages/CreateGroup";
import GroupJoinButton from "./GroupJoinButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useState } from "react";

const GroupSearch = (props: { groups: Group[] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [user] = useAuthState(auth);

  return (
    <>
      <InputGroup mt={4} size={"sm"}>
        <Input
          textAlign={"center"}
          color="black"
          onInput={(e) => setSearch(e.currentTarget.value)}
          value={search}
          _placeholder={{ color: "black" }}
          placeholder="Find Public Groups"
          borderRadius={5}
        />
        <InputRightElement color={"black"}>
          <IconButton
            size="sm"
            aria-label=""
            icon={<GiMagnifyingGlass />}
            onClick={onOpen}
          />
        </InputRightElement>
      </InputGroup>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Found Public Groups</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              {props.groups
                .filter((group: Group) => {
                  // Groups should only be listed if they are public
                  // and the user isn't already in that group
                  // and the group name contains the search request
                  return (
                    !group.isPrivate &&
                    user?.uid &&
                    !group.members[user.uid] &&
                    group.name.toLowerCase().includes(search.toLowerCase())
                  );
                })
                .map((publicGroup: Group, i: number) => {
                  return (
                    <HStack key={i} w="full">
                      <Heading size="sm">{publicGroup.name}</Heading>
                      <GroupJoinButton group={publicGroup} userId={user?.uid} />
                    </HStack>
                  );
                })}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupSearch;
