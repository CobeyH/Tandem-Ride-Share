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
} from "@chakra-ui/react";
import * as React from "react";
import PriceSelector from "../components/Promotional/PriceSelector";
import ProductHeader from "../components/Promotional/ProductHeader";
import { Testimonal as Testimonial } from "../components/Promotional/Testimonial";
import { styleColors } from "../theme/colours";
import { useRef } from "react";
import { EmailIcon } from "@chakra-ui/icons";

function Footer() {
  return (
    <Box bgColor="white" textAlign="center">
      <HStack p={4}>
        <Stack direction={{ base: "column", md: "row" }}>
          <Image
            src={"/logo_darkBlue.svg"}
            alt="dark blue logo"
            objectFit="cover"
            maxW="50px"
          />
          <Text color={styleColors.darkBlue} p={1}>
            Tandem
          </Text>
        </Stack>
        <Spacer />
        <VStack align="center">
          <Text fontWeight={"bold"} color={styleColors.deepBlue} fontSize="70%">
            Company
          </Text>
          <Text color={styleColors.deepBlue} fontSize="65%">
            About Us
          </Text>
          <Text color={styleColors.deepBlue} fontSize="65%">
            Contact Us
          </Text>
          <Text color={styleColors.deepBlue} fontSize="65%">
            Pricing
          </Text>
          <Text color={styleColors.deepBlue} fontSize="65%">
            Testimonials
          </Text>
        </VStack>
        <VStack>
          <Text fontWeight={"bold"} color={styleColors.deepBlue} fontSize="70%">
            Support
          </Text>
          <Text color={styleColors.deepBlue} fontSize="65%">
            Help Center
          </Text>
          <Text color={styleColors.deepBlue} fontSize="65%">
            Privacy Policy
          </Text>
          <Text color={styleColors.deepBlue} fontSize="65%">
            Legal
          </Text>
          <Text color={styleColors.deepBlue} fontSize="65%">
            Terms of Service
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
        bgColor="rgba(256,256,256,0.5)"
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

  return (
    <Box
      h="-webkit-fit-content"
      bgGradient={`linear(to-br, ${styleColors.mainBlue}, ${styleColors.lightBlue})`}
    >
      <ProductHeader
        scrollToProducts={() =>
          productsRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        scrollToTestimonials={() =>
          testimonialsRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        scrollToAboutUs={() =>
          aboutUsRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        scrollToContactUs={() =>
          aboutUsRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <Box h="-webkit-fit-content" ml={5} mr={5}>
        <Center>
          <HStack pt={{ base: 75, md: 175 }} pb={125}>
            <VStack align="center">
              <VStack align="left">
                <Text
                  color={styleColors.deepBlue}
                  fontSize={30}
                  fontWeight={"bold"}
                  align="center"
                >
                  Carpooling made easy.
                </Text>
                <Text
                  color={styleColors.deepBlue}
                  fontSize={30}
                  fontWeight={"bold"}
                  align="center"
                >
                  Carpooling made social.
                </Text>
              </VStack>
              <Text color={styleColors.deepBlue} fontSize={18} align="center">
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
              bgGradient={`linear(to-r, ${styleColors.medBlue}, ${styleColors.mainBlue})`}
              bgClip="text"
              fontWeight="extrabold"
              fontSize={50}
              align="center"
            >
              Testimonials
            </Text>
            <Testimonial />
          </Box>
        </Center>
        <VStack pb={25}>
          <Text
            bgGradient={`linear(to-r, ${styleColors.medBlue}, ${styleColors.mainBlue})`}
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
            bgGradient={`linear(to-r, ${styleColors.medBlue}, ${styleColors.mainBlue})`}
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
      <Footer />
    </Box>
  );
};

export default ProductPage;
