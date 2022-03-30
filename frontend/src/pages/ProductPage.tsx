import {
  Box,
  Text,
  HStack,
  Image,
  Spacer,
  Center,
  VStack,
  Stack,
  Link,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import PriceSelector from "../components/Promotional/PriceSelector";
import ProductHeader from "../components/Promotional/ProductHeader";
import { Testimonal as Testimonial } from "../components/Promotional/Testimonial";
import { styleColors } from "../theme/colours";
import { useRef } from "react";
import { EmailIcon } from "@chakra-ui/icons";

function ProductFooter({
  scrollToProducts,
  scrollToTestimonials,
  scrollToAboutUs,
  scrollToContactUs,
}: {
  scrollToProducts: () => void;
  scrollToTestimonials: () => void;
  scrollToAboutUs: () => void;
  scrollToContactUs: () => void;
}) {
  const fontColor = useColorModeValue(
    styleColors.deepBlue,
    styleColors.lightBlue
  );
  return (
    <Box
      bgColor={useColorModeValue("white", styleColors.charcoal)}
      textAlign="center"
    >
      <HStack p={4}>
        <Stack
          direction={{ base: "column", md: "row" }}
          align="center"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Image
            src={`/logo_${useColorModeValue("darkBlue", "white")}.svg`}
            alt="dark blue logo"
            objectFit="cover"
            maxW="50px"
          />
          <Text color={fontColor} p={1}>
            Tandem
          </Text>
        </Stack>
        <Spacer />
        <VStack align="center">
          <Text fontWeight={"bold"} color={fontColor} fontSize="70%">
            Company
          </Text>
          <Text color={fontColor} fontSize="65%" onClick={scrollToProducts}>
            Pricing
          </Text>
          <Text color={fontColor} fontSize="65%" onClick={scrollToTestimonials}>
            Testimonials
          </Text>
        </VStack>
        <VStack>
          <Text
            fontWeight={"bold"}
            color={fontColor}
            fontSize="70%"
            onClick={scrollToAboutUs}
          >
            Support
          </Text>
          <Text color={fontColor} fontSize="65%" onClick={scrollToAboutUs}>
            About Us
          </Text>
          <Text color={fontColor} fontSize="65%" onClick={scrollToContactUs}>
            Contact Us
          </Text>
        </VStack>
        <Spacer />
      </HStack>
    </Box>
  );
}
function AboutUs() {
  const toast = useToast();

  return (
    <Box as="section">
      <Box
        maxW="3xl"
        mx="auto"
        px={{ base: "6", md: "8" }}
        pt="12"
        pb="16"
        borderColor={styleColors.deepBlue}
        borderWidth={0}
        borderRadius={15}
        bgColor={useColorModeValue("rgba(256,256,256,0.5)", "rgba(0,0,0,0.5)")}
      >
        <VStack align="center" textAlign="center">
          <Text>
            We&apos;re a group of 5 UVic students who hope to make carpooling
            delightful. This was started as a class project for Startup
            Programming.
          </Text>
          <Text>
            The Project is all open source - you can check it out{" "}
            <Link
              href={"https://github.com/CobeyH/SENG-480A"}
              color={"blue.300"}
            >
              here
            </Link>
          </Text>
          <Text>
            You can reach out using the{" "}
            <Link
              href={"https://github.com/CobeyH/SENG-480A"}
              color={"blue.300"}
            >
              github
            </Link>{" "}
            or by sending an email to{" "}
            <Link
              onClick={() => {
                navigator.clipboard
                  .writeText("CobeyHollier@gmail.com")
                  .then(() => {
                    toast({
                      title: "Copied Email to Clipboard",
                      status: "success",
                      isClosable: true,
                    });
                  });
              }}
            >
              our support team
            </Link>{" "}
            <Link href={"mailto:CobeyHollier@gmail.com"}>
              <EmailIcon />
            </Link>
            .
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

const ProductPage = () => {
  const productsRef = useRef<HTMLDivElement | null>(null);
  const testimonialsRef = useRef<HTMLDivElement | null>(null);
  const aboutUsRef = useRef<HTMLDivElement | null>(null);

  const scrollToProducts = () =>
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToTestimonials = () =>
    testimonialsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToAboutUs = () =>
    aboutUsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToContactUs = () =>
    aboutUsRef.current?.scrollIntoView({ behavior: "smooth" });
  return (
    <Box
      h="-webkit-fit-content"
      bgGradient={useColorModeValue(
        `linear(to-br, ${styleColors.mainBlue}, ${styleColors.lightBlue})`,
        `linear(to-br, ${styleColors.deepBlue}, ${styleColors.mainBlue})`
      )}
    >
      <ProductHeader
        scrollToProducts={scrollToProducts}
        scrollToTestimonials={scrollToTestimonials}
        scrollToAboutUs={scrollToAboutUs}
        scrollToContactUs={scrollToContactUs}
      />
      <Box h="-webkit-fit-content" ml={5} mr={5}>
        <Center>
          <HStack pt={{ base: 75, md: 175 }} pb={125}>
            <VStack align="center">
              <VStack align="left">
                <Text
                  color={useColorModeValue(
                    styleColors.deepBlue,
                    styleColors.lightBlue
                  )}
                  fontSize={30}
                  fontWeight={"bold"}
                  align="center"
                >
                  Carpooling made easy.
                </Text>
                <Text
                  color={useColorModeValue(
                    styleColors.deepBlue,
                    styleColors.lightBlue
                  )}
                  fontSize={30}
                  fontWeight={"bold"}
                  align="center"
                >
                  Carpooling made social.
                </Text>
              </VStack>
              <Text
                color={useColorModeValue(
                  styleColors.deepBlue,
                  styleColors.lightBlue
                )}
                fontSize={18}
                align="center"
              >
                Connect your circles and get where you need to go together.
              </Text>
              <Box p={35}>
                <Image
                  src={"/logo_white.svg"}
                  alt="white logo"
                  objectFit="cover"
                  maxW="200px"
                />
                <Text color="white" fontSize={30} align="center">
                  Ride Tandem.
                </Text>
              </Box>
            </VStack>
          </HStack>
        </Center>
        <Center>
          <Box w="90vw" pt={10} pb={100} ref={testimonialsRef}>
            <Text
              bgGradient={useColorModeValue(
                `linear(to-r, ${styleColors.medBlue}, ${styleColors.mainBlue})`,
                `linear(to-r, ${styleColors.mainBlue}, ${styleColors.medBlue})`
              )}
              bgClip="text"
              fontWeight="extrabold"
              fontSize={50}
              align="center"
              mb={10}
            >
              Testimonials
            </Text>
            <Testimonial />
          </Box>
        </Center>
        <VStack pb={25}>
          <Text
            bgGradient={useColorModeValue(
              `linear(to-r, ${styleColors.medBlue}, ${styleColors.mainBlue})`,
              `linear(to-r, ${styleColors.deepBlue}, ${styleColors.deepBlue})`
            )}
            bgClip="text"
            fontWeight="extrabold"
            fontSize={50}
            align="center"
          >
            Pricing
          </Text>
          <Box pb={50} ref={productsRef}>
            <PriceSelector showSelectors={false} />
          </Box>
        </VStack>
        <Spacer />
      </Box>
      <Center>
        <Box w="90vw" pt={10} pb={100} ref={aboutUsRef}>
          <Text
            bgGradient={useColorModeValue(
              `linear(to-r, ${styleColors.mainBlue}, ${styleColors.medBlue})`,
              `linear(to-r, ${styleColors.deepBlue}, ${styleColors.medBlue})`
            )}
            bgClip="text"
            fontWeight="extrabold"
            fontSize={50}
            align="center"
          >
            About Us
          </Text>
          <AboutUs />
        </Box>
      </Center>
      <ProductFooter
        scrollToProducts={scrollToProducts}
        scrollToTestimonials={scrollToTestimonials}
        scrollToAboutUs={scrollToAboutUs}
        scrollToContactUs={scrollToContactUs}
      />
    </Box>
  );
};

export default ProductPage;
