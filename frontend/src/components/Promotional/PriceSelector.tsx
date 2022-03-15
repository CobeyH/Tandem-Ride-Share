import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { FaUserAlt, FaUserFriends, FaUsers } from "react-icons/all";
import { PricingCard } from "./PricingCard";

export type PlanInfo = {
  data: {
    price: string;
    numericPrice: number;
    name: PlanTypes;
    features: string[];
    limit?: number;
  };
  icon: IconType;
};

export type PlanTypes =
  | "Friend Group"
  | "Small Organization"
  | "Large Organization"
  | "Enterprise";

export const planData: PlanInfo[] = [
  {
    data: {
      price: "Free",
      numericPrice: 0,
      limit: 10,
      name: "Friend Group",
      features: ["Limit 10 people", "Gas calculator", "Optimized Pickups"],
    },
    icon: FaUserAlt,
  },
  {
    data: {
      price: "$5",
      limit: 25,
      numericPrice: 5,
      name: "Small Organization",
      features: ["Limit 25 people", "Gas calculator", "Optimized Pickups"],
    },
    icon: FaUserFriends,
  },
  {
    data: {
      price: "$10",
      numericPrice: 10,
      limit: 50,
      name: "Large Organization",
      features: ["Limit 50 people", "Gas calculator", "Optimized Pickups"],
    },
    icon: FaUserFriends,
  },
  {
    data: {
      price: "$29",
      numericPrice: 29,
      name: "Enterprise",
      features: ["No group limits", "Gas calculator", "Optimized Pickups"],
    },
    icon: FaUsers,
  },
];

export function groupMaxSize(groupPlan: PlanTypes) {
  return (
    planData.find((p: PlanInfo) => p.data.name === groupPlan)?.data.limit || 0
  );
}

const PriceSelector = (props: {
  showSelectors: boolean;
  updateGroupPlan?: (newPlan: PlanTypes) => void;
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanTypes>("Friend Group");

  return (
    <Box as="section" bg="" py="14" px={{ base: "2", md: "8" }}>
      <SimpleGrid
        columns={{ base: 2, lg: 4 }}
        maxW="7xl"
        mx="auto"
        justifyItems="center"
        alignItems="center"
      >
        {planData.map((card: PlanInfo) => (
          <PricingCard
            minHeight={550}
            key={card.data.name}
            data={card.data}
            icon={card.icon}
            highlight={card.data.name == selectedPlan}
            button={
              card.data.name == selectedPlan ? (
                <></>
              ) : (
                <Button
                  onClick={() => {
                    setSelectedPlan(card.data.name);
                    if (props.updateGroupPlan)
                      props.updateGroupPlan(card.data.name);
                  }}
                >
                  Select
                </Button>
              )
            }
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PriceSelector;
