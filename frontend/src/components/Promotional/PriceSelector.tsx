import { Box, Button, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { FaUserAlt, FaUserFriends, FaUsers } from "react-icons/all";
import { PricingCard } from "./PricingCard";

const PriceSelector = () => (
  <Box as="section" bg="" py="14" px={{ base: "4", md: "8" }}>
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
          price: "Free",
          name: "Friend Group",
          features: ["Limit 10 people", "Gas calculator", "Optimized Pickups"],
        }}
        icon={FaUserAlt}
        button={<Button>Buy now</Button>}
      />
      <PricingCard
        zIndex={1}
        transform={{ lg: "scale(1.05)" }}
        data={{
          price: "$5",
          name: "Small Organization",
          features: ["Limit 25 people", "Gas calculator", "Optimized Pickups"],
        }}
        icon={FaUserFriends}
        button={<Button>Buy now</Button>}
      />
      <PricingCard
        data={{
          price: "$10",
          name: "Large Organization",
          features: ["Limit 50 people", "Gas calculator", "Optimized Pickups"],
        }}
        icon={FaUserFriends}
        button={<Button>Buy now</Button>}
      />
      <PricingCard
        data={{
          price: "$29",
          name: "Enterprise",
          features: ["No group limits", "Gas calculator", "Optimized Pickups"],
        }}
        icon={FaUsers}
        button={<Button>Buy now</Button>}
      />
    </SimpleGrid>
  </Box>
);

export default PriceSelector;
