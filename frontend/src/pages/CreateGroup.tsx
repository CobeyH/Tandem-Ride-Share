import React, { useState } from "react";
import {
  Heading,
  Input,
  Text,
  Stack,
  HStack,
  Textarea,
  Checkbox,
  Tooltip,
  Container,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tab,
  VStack,
  Box,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import {
  DBConstants,
  getGroup,
  Group,
  setGroup,
  setGroupBanner,
  setGroupProfilePic,
} from "../firebase/database";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import Header from "../components/Header";
import { PhotoType, uploadPhoto } from "../firebase/storage";
import FileDropzone from "../components/FileDropzone";
import PriceSelector, {
  PlanTypes,
} from "../components/Promotional/PriceSelector";
import { Steps, useSteps } from "chakra-ui-steps";
import VerifiedStep from "../components/VerifiedStep";
import {
  FaClipboard,
  FaUserFriends,
  ImQuill,
  IoMdPhotos,
} from "react-icons/all";
import IconBrowser from "../components/Groups/IconBrowser";

type ValidatableFiled<T> = {
  field: T;
  invalid: boolean;
};

const createGroup = async (groupData: Omit<Group, "id">, userId: string) => {
  const group = {
    ...groupData,
    id: slugify(groupData.name, DBConstants.KEY_SLUG_OPTS),
  };
  await getGroup(group.id)
    .then(() => {
      /* TODO: increment id */
      throw new Error("Group ID already exists");
    })
    .catch((err) => {
      if (err === undefined) {
        group.members[userId] = true;
        setGroup(group);
      }
    });
  return group;
};

const CreateGroup = () => {
  // TODO: Fix type
  const [banner, setBanner] = useState<Blob | MediaSource>();
  const [profilePic, setProfilePic] = useState<Blob | MediaSource>();
  const [chosenIcon, setChosenIcon] = useState("");

  const handleCallback = (childBanner: Blob | MediaSource) => {
    setBanner(childBanner);
  };

  const handleProfilePicSubmit = (childPic: Blob | MediaSource) => {
    setProfilePic(childPic);
  };
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const [user] = useAuthState(auth);
  const [{ field: name, invalid: invalidName }, setName] = useState<
    ValidatableFiled<string>
  >({
    field: user?.displayName ? user.displayName + "'s Group" : "",
    invalid: false,
  });
  const [description, setDescription] = useState("");
  const [isPrivate, setPrivate] = useState<boolean>(true);
  const [plan, setPlan] = useState<PlanTypes>("Friend Group");
  const MAX_GROUP_NAME_LENGTH = 25;

  const isInvalidName = (name: string) => name.length === 0;
  const navigate = useNavigate();

  const submitGroup = () => {
    if (user?.uid !== undefined && plan) {
      createGroup(
        {
          description,
          isPrivate,
          name,
          rides: {},
          members: {},
          owner: user?.uid,
          plan,
        },
        user.uid
      ).then((group) => {
        navigate(`/group/${group.id}`);
        if (banner !== undefined) {
          uploadPhoto(group.id, PhotoType.banners, banner).then((url) => {
            setGroupBanner(group.id, url?.fullPath);
          });
        }
        if (profilePic) {
          uploadPhoto(group.id, PhotoType.profilePics, profilePic).then(
            (url) => {
              setGroupProfilePic(group.id, url?.fullPath);
            }
          );
        } else if (chosenIcon && chosenIcon.length > 0) {
          setGroupProfilePic(group.id, chosenIcon);
        }
      });
    }
  };

  return (
    <>
      <Header pages={[{ label: "My Groups", url: "/" }]} />
      <Container maxWidth="90%">
        <Heading textAlign={"center"}>Create Group</Heading>
        <Steps activeStep={activeStep} orientation="vertical">
          <VerifiedStep
            label="Group Name"
            description={name}
            currentInput={name}
            isVerified={(name) => name.length !== 0}
            isFirstStep={true}
            nextStep={nextStep}
            prevStep={prevStep}
            icon={FaClipboard}
          >
            <Input
              value={name}
              placeholder={"name"}
              onInput={(e) =>
                setName({
                  field: e.currentTarget.value,
                  invalid: isInvalidName(e.currentTarget.value),
                })
              }
              isInvalid={invalidName}
              maxLength={MAX_GROUP_NAME_LENGTH}
            />
            <Text
              color="grey.200"
              size="sm"
              align="right"
            >{`${name.length} / ${MAX_GROUP_NAME_LENGTH}`}</Text>
          </VerifiedStep>
          <VerifiedStep
            label="Description"
            currentInput={description}
            isVerified={() => true}
            prevStep={prevStep}
            nextStep={nextStep}
            icon={ImQuill}
          >
            <Textarea
              value={description}
              placeholder={"Description"}
              onInput={(e) => setDescription(e.currentTarget.value)}
              isInvalid={invalidName}
            />
          </VerifiedStep>
          <VerifiedStep
            label="Choose a Plan"
            currentInput={plan}
            isVerified={(plan) => plan !== undefined}
            prevStep={prevStep}
            nextStep={nextStep}
            icon={FaUserFriends}
          >
            <Stack>
              <PriceSelector showSelectors={true} updateGroupPlan={setPlan} />
              <HStack>
                <Tooltip
                  label="Private groups are only joinable through an invite link from a group member"
                  hasArrow
                >
                  <Text mb={"8px"}>Private Group:</Text>
                </Tooltip>
                <Checkbox
                  isChecked={isPrivate}
                  onChange={(e) => setPrivate(e.target.checked)}
                />
              </HStack>
            </Stack>
          </VerifiedStep>
          <VerifiedStep
            label="Upload Media"
            currentInput={banner}
            isVerified={() => true}
            prevStep={prevStep}
            nextStep={submitGroup}
            icon={IoMdPhotos}
            isLastStep={true}
          >
            <VStack align="center" height="100%" width="100%" p={4} spacing={4}>
              <Heading size="md"> Upload Banner</Heading>
              <FileDropzone parentCallback={handleCallback} />
              <Heading size="md"> Upload Profile Picture</Heading>
              <HStack alignItems="center">
                <Tabs isFitted>
                  <TabList>
                    <Tab>Upload a profile picture</Tab>
                    <Tab>Choose an Icon</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <FileDropzone parentCallback={handleProfilePicSubmit} />
                      <Box py={149}></Box>
                    </TabPanel>
                    <TabPanel>
                      <IconBrowser
                        icon={chosenIcon}
                        updateIcon={setChosenIcon}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </HStack>
            </VStack>
          </VerifiedStep>
        </Steps>
      </Container>
    </>
  );
};

export default CreateGroup;
