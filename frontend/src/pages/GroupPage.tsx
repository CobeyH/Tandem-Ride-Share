import * as React from "react";
import {
  Button,
  Heading,
  Text,
  VStack,
  Image,
  Box,
  Container,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Group, useGroup } from "../firebase/database";
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
import GroupSelector from "../components/Groups/GroupSelector";
import { LoadingPage } from "../App";
import { styleColors } from "../theme/colours";
import { GiBallerinaShoes } from "react-icons/gi";

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
    <HStack alignItems="flex-start" spacing={0} h="100vh">
      <GroupSelector />
      {loading ? (
        <LoadingPage />
      ) : error ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : group ? (
        <SingleGroup group={group} />
      ) : (
        <Text>No such group exists</Text>
      )}
    </HStack>
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
    <Box flexGrow={1}>
      <Header />
      {bannerLoading || error ? (
        <Box
          bg={styleColors.mainBlue}
          h="10%"
          w="100%"
          maxHeight="200px"
          minHeight="100"
        />
      ) : (
        <Image src={banner} width="100%" maxHeight="200px" objectFit="cover" />
      )}

      <Container>
        <VStack spacing="24px" align="center">
          {/*This should be changed to the group icon or group image*/}
          <IconButton
            mt={5}
            icon={<GiBallerinaShoes />}
            isRound
            boxSize={{ base: "80px", md: "100px" }}
            fontSize={{ base: "60px", md: "80px" }}
            color={styleColors.deepBlue}
            aria-label={""}
          />
          <Heading textAlign={"center"} mt={5}>
            {group.name}
          </Heading>
          <HStack mt={5} align="center" spacing={5}>
            <ShareLink user={user} />
            <GroupDrawer
              members={group.members}
              ownerId={group.owner}
              maxSize={groupMaxSize(group.plan)}
              groupId={group.id}
            />
            {group.owner === user?.uid ? <GroupSettings group={group} /> : null}
          </HStack>
          {group.description && group.description.length > 0 ? (
            <Box px={5} py={5} textAlign="left" w="100%">
              {group.description}
            </Box>
          ) : null}
          <Box
            textAlign="left"
            fontWeight="bold"
            fontSize="22"
            w="100%"
            px={5}
            pt={5}
            pb={2}
          >
            Active Rides
          </Box>
          {group.rides ? (
            Object.keys(group.rides).map((key) => (
              <RideCard key={key} rideId={key} isActive={true} />
            ))
          ) : (
            <>
              <Text>There are no currently active rides...</Text>
              <Button
                fontWeight="normal"
                onClick={() => {
                  navigate(`/group/${group.id}/ride/new`);
                }}
              >
                Create a new ride
              </Button>
            </>
          )}
          <Box
            textAlign="left"
            fontWeight="bold"
            fontSize="22"
            w="100%"
            px={5}
            pt={5}
            pb={2}
          >
            Previous Rides
          </Box>
          {group.rides
            ? Object.keys(group.rides).map((key) => (
                <RideCard key={key} rideId={key} isActive={false} />
              ))
            : null}
        </VStack>
      </Container>
    </Box>
  );
};
