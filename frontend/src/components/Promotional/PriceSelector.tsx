import { Box, Button, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { SiHive, SiMarketo, SiMicrosoft } from "react-icons/si";
import { PricingCard } from "./PricingCard";

const PriceSelector = () => (
  <Box
    as="section"
    bg={useColorModeValue("gray.50", "gray.800")}
    py="14"
    px={{ base: "4", md: "8" }}
  >
    <SimpleGrid
      columns={{ base: 1, lg: 4 }}
      spacing={{ base: "8", lg: "0" }}
      maxW="7xl"
      mx="auto"
      justifyItems="center"
      alignItems="center"
    >
      <PricingCard
        data={{
          price: "$29",
          name: "Application UI",
          features: [
            "All application UI components",
            "Lifetime access",
            "Use on unlimited projects",
            "Free Updates",
          ],
        }}
        icon={SiMicrosoft}
        button={<Button borderWidth="2px">Buy now</Button>}
      />
      <PricingCard
        zIndex={1}
        isPopular
        transform={{ lg: "scale(1.05)" }}
        data={{
          price: "$49",
          name: "Bundle",
          features: [
            "All application UI components",
            "Lifetime access",
            "Use on unlimited projects",
            "Use on unlimited projects",
            "Free Updates",
          ],
        }}
        icon={SiHive}
        button={<Button>Buy now</Button>}
      />
      <PricingCard
        data={{
          price: "$29",
          name: "Marketing UI",
          features: [
            "All application UI components",
            "Lifetime access",
            "Use on unlimited projects",
            "Free Updates",
          ],
        }}
        icon={SiMarketo}
        button={<Button borderWidth="2px">Buy now</Button>}
      />
      <PricingCard
        data={{
          price: "$29",
          name: "Marketing UI",
          features: [
            "All application UI components",
            "Lifetime access",
            "Use on unlimited projects",
            "Free Updates",
          ],
        }}
        icon={SiMarketo}
        button={<Button borderWidth="2px">Buy now</Button>}
      />
    </SimpleGrid>
  </Box>
);

export default PriceSelector;
