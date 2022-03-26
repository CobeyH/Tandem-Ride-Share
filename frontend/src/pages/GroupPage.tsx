import * as React from "react";
import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Group, removeUserFromGroup, useGroup } from "../firebase/database";
import { Val } from "react-firebase-hooks/database/dist/database/types";
import RideCard from "../components/Rides/RideCard";
import Header from "../components/Header";
import { storage } from "../firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { ref as storageRef } from "firebase/storage";
import ShareLink from "../components/Groups/ShareLink";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { groupMaxSize } from "../components/Promotional/PriceSelector";
import GroupSettings from "../components/Groups/GroupSettings";
import GroupDrawer from "../components/Groups/GroupDrawer";
import { LoadingPage } from "../App";
import { FaWalking } from "react-icons/all";

export default function GroupPage() {
  const navigate = useNavigate();
  const groupId = useParams()["groupId"];
  if (groupId === undefined) {
    console.log("figure something better to do here");
    navigate("/");
    return null;
  }
  const [group, loading, error] = useGroup(groupId);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : error ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : group ? (
        <SingleGroup group={group} />
      ) : (
        <Text>No such group exists</Text>
      )}
    </>
  );
}

function LeaveGroupButton({
  groupId,
  userId,
}: {
  userId: string;
  groupId: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <Button size="sm" rightIcon={<Icon as={FaWalking} />} onClick={onOpen}>
        Leave{" "}
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

const SingleGroup = ({ group }: { group: Val<Group> }) => {
  const navigate = useNavigate();
  const bannerRef = group.banner
    ? storageRef(storage, group.banner)
    : undefined;
  const [banner, bannerLoading, error] = useDownloadURL(bannerRef);
  const [user] = useAuthState(auth);

  return (
    <>
      <Header pages={[{ label: "My Groups", url: "/" }]} />
      {bannerLoading || error ? (
        <Box bg="blue" h="10%" w="100%" maxHeight="200px" minHeight="100" />
      ) : (
        <Image src={banner} width="100%" maxHeight="200px" objectFit="cover" />
      )}
      <Container>
        <VStack spacing="24px" align="c">
          <HStack pt={5}>
            <ShareLink user={user} />
            <GroupDrawer
              members={group.members}
              ownerId={group.owner}
              maxSize={groupMaxSize(group.plan)}
              groupId={group.id}
            />
            {
              user ? (
                group.owner === user.uid ? (
                  <GroupSettings group={group} />
                ) : (
                  <LeaveGroupButton userId={user.uid} groupId={group.id} />
                )
              ) : null /*User should really never be null here. */
            }
          </HStack>

          <Heading textAlign={"center"}>{group.name}</Heading>
          {group.description && group.description.length > 0 ? (
            <Box px={5} py={5} borderRadius={5} borderWidth={3}>
              {group.description}
            </Box>
          ) : null}
          <Text>Active Rides</Text>
          {group.rides
            ? Object.keys(group.rides).map((key) => (
                <RideCard key={key} rideId={key} isActive={true} />
              ))
            : null}
          <Text>Previous Rides</Text>
          {group.rides
            ? Object.keys(group.rides).map((key) => (
                <RideCard key={key} rideId={key} isActive={false} />
              ))
            : null}
          <Button
            onClick={() => {
              navigate(`/group/${group.id}/ride/new`);
            }}
          >
            New Ride
          </Button>
        </VStack>
      </Container>
    </>
  );
};
