import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import * as React from "react";
import { ImQuotesLeft } from "react-icons/all";
import { styleColors } from "../../theme/colours";
import { Quotee } from "./Quotee";

export const Testimonal = () => (
  <Box as="section">
    <SimpleGrid columns={{ base: 1, sm: 1, md: 2 }} spacing={5}>
      <Box
        maxW="3xl"
        px={{ base: "6", md: "8" }}
        pt="12"
        pb="16"
        borderWidth={0}
        borderRadius={15}
        bgColor={useColorModeValue("rgba(256,256,256,0.5)", "rgba(0,0,0,0.5)")}
      >
        <Flex direction="column" align="center" textAlign="center">
          <ImQuotesLeft
            color={useColorModeValue(
              "${styleColors.deepBlue}",
              "${styleColors.deepBlue}"
            )}
          />
          <Box mt={42}>
            <Text fontSize={{ base: "l", md: "xl" }} fontWeight="medium" mt="6">
              &ldquo;Clear layout & fun to use!&rdquo;
            </Text>
            <Quotee name="Tim Ruigrok" jobTitle="Tandem User" mt="8" />
          </Box>
        </Flex>
      </Box>
      <Box
        maxW="3xl"
        px={{ base: "6", md: "8" }}
        pt="12"
        pb="16"
        borderColor={styleColors.deepBlue}
        borderWidth={0}
        borderRadius={15}
        bgColor={useColorModeValue("rgba(256,256,256,0.5)", "rgba(0,0,0,0.5)")}
      >
        <Flex direction="column" align="center" textAlign="center">
          <ImQuotesLeft
            color={useColorModeValue(
              "${styleColors.deepBlue}",
              "${styleColors.deepBlue}"
            )}
          />
          <Box mt={41}>
            <Text fontSize={{ base: "l", md: "xl" }} fontWeight="medium" mt="6">
              &ldquo;Fun and fresh perspective to look at car pooling!&rdquo;
            </Text>
            <Quotee name="Kutay" jobTitle="Tandem User" mt="8" />
          </Box>
        </Flex>
      </Box>
      <Box
        maxW="3xl"
        px={{ base: "6", md: "8" }}
        pt="12"
        pb="16"
        borderColor={styleColors.deepBlue}
        borderWidth={0}
        borderRadius={15}
        bgColor={useColorModeValue("rgba(256,256,256,0.5)", "rgba(0,0,0,0.5)")}
      >
        <Flex direction="column" align="center" textAlign="center">
          <ImQuotesLeft
            color={useColorModeValue(
              "${styleColors.deepBlue}",
              "${styleColors.deepBlue}"
            )}
          />
          <Box mt={47}>
            <Text fontSize={{ base: "l", md: "xl" }} fontWeight="medium" mt="6">
              &ldquo;This app reminded me how much money everyone from high
              school to now owes me. 10/10&rdquo;
            </Text>
          </Box>
          <Quotee name="Oscar" jobTitle="Tandem User" mt="8" />
        </Flex>
      </Box>
      <Box
        maxW="3xl"
        px={{ base: "6", md: "8" }}
        pt="12"
        pb="16"
        borderColor={styleColors.deepBlue}
        borderWidth={0}
        borderRadius={15}
        bgColor={useColorModeValue("rgba(256,256,256,0.5)", "rgba(0,0,0,0.5)")}
      >
        <Flex direction="column" align="center" textAlign="center">
          <ImQuotesLeft
            color={useColorModeValue(
              "${styleColors.deepBlue}",
              "${styleColors.deepBlue}"
            )}
          />
          <Text fontSize={{ base: "l", md: "xl" }} fontWeight="medium" mt="6">
            &ldquo;It is really simple and straight forward. Being able share is
            also a huge plus because most (apps) restrict that so you don&apos;t
            just arrange a ride out of the app&rdquo;
          </Text>
          <Quotee name="Adrian Ruigrok" jobTitle="Tandem User" mt="8" />
        </Flex>
      </Box>
    </SimpleGrid>
  </Box>
);
