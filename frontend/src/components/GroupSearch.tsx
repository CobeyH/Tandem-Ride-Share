import * as React from "react";
import {
  Button,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
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
          color="white"
          onInput={(e) => setSearch(e.currentTarget.value)}
          value={search}
          _placeholder={{ color: "white" }}
          placeholder="Find Public Groups"
        />
        <InputLeftElement color={"white"}>
          <GiMagnifyingGlass />
        </InputLeftElement>
        <Button onClick={onOpen}>Submit</Button>
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
                    group.name.includes(search)
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
