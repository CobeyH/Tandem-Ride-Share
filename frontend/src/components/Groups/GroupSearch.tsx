import * as React from "react";
import {
  Button,
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
  Spacer,
  useDisclosure,
  VStack,
  Text,
  Box,
  Center,
} from "@chakra-ui/react";
import { GiMagnifyingGlass } from "react-icons/gi";
import GroupJoinButton from "./GroupJoinButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import { useState } from "react";
import { Group } from "../../firebase/database";
import GroupCapacity from "./GroupCapacity";
import { useNavigate } from "react-router-dom";

const GroupSearch = (props: { groups: Group[] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const publicGroups: Group[] = props.groups.filter((group: Group) => {
    // Groups should only be listed if they are public
    // and the user isn't already in that group
    // and the group name contains the search request
    return (
      !group.isPrivate &&
      user?.uid &&
      !group.members[user.uid] &&
      group.name.toLowerCase().includes(search.toLowerCase())
    );
  });

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
            aria-label="Search Groups"
            icon={<GiMagnifyingGlass />}
            onClick={onOpen}
          />
        </InputRightElement>
      </InputGroup>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>
            {publicGroups.length > 0
              ? "Found Public Groups"
              : "No Public Groups Found"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              {publicGroups.length === 0 ? (
                <Box>
                  <Text>
                    Please refine your search request or create your own group.
                  </Text>
                  <Center>
                    <Button my={6} onClick={() => navigate("group/new")}>
                      Create a Group
                    </Button>
                  </Center>
                </Box>
              ) : (
                publicGroups.map((publicGroup: Group, i: number) => {
                  return (
                    <HStack key={i} w="full">
                      <Heading size="sm">{publicGroup.name}</Heading>
                      <Spacer />
                      <GroupCapacity group={publicGroup} />
                      <Button
                        onClick={() =>
                          navigate(`/group/${publicGroup.id}/join`)
                        }
                      >
                        Preview
                      </Button>
                      <GroupJoinButton group={publicGroup} userId={user?.uid} />
                    </HStack>
                  );
                })
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupSearch;
