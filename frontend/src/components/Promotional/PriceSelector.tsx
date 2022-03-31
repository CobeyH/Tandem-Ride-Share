import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { FaUserAlt, FaUserFriends, FaUsers } from "react-icons/all";
import { PricingCard } from "./PricingCard";

export type PlanInfo = {
  data: {
    price: string;
    numericPrice: number;
    name: string;
    key: PlanTypes;
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
      key: "Friend Group",
      name: "Friend Group",
      features: ["Up to 10 people", "Gas calculator", "Optimized Pickups"],
    },
    icon: FaUserAlt,
  },
  {
    data: {
      price: "$5",
      limit: 25,
      numericPrice: 5,
      key: "Small Organization",
      name: "Friend Group Pro",
      features: [
        "Up to 25 people",
        "Multi-car trips",
        "Turn by turn navigation",
        "Ride packing lists",
      ],
    },
    icon: FaUserFriends,
  },
  {
    data: {
      price: "$10",
      numericPrice: 10,
      limit: 50,
      key: "Large Organization",
      name: "Community",
      features: [
        "Up to 50 people",
        "Multi-car trips",
        "Turn by turn navigation",
        "Ride packing lists",
      ],
    },
    icon: FaUserFriends,
  },
  {
    data: {
      price: "$29",
      numericPrice: 29,
      key: "Enterprise",
      name: "Business",
      features: [
        "Unlimited users",
        "Multi-car trips",
        "Turn by turn navigation",
        "Ride packing lists",
      ],
    },
    icon: FaUsers,
  },
];

export function groupMaxSize(groupPlan: PlanTypes) {
  return (
    planData.find((p: PlanInfo) => p.data.key === groupPlan)?.data.limit ||
    100000
  );
}

const PriceSelector = ({
  showSelectors,
  updateGroupPlan,
}: {
  showSelectors: boolean;
  updateGroupPlan?: (newPlan: PlanTypes) => void;
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanTypes>("Friend Group");

  return (
    <Box as="section" bg="" py="14" px={{ base: "2", md: "8" }}>
      <SimpleGrid
        columns={{ base: 2, lg: 4 }}
        maxW="7xl"
        minWidth={{ base: 150 }}
        mx="auto"
        justifyItems="center"
        alignItems="center"
      >
        {planData.map((card: PlanInfo) => (
          <PricingCard
            minHeight={550}
            key={card.data.key}
            data={card.data}
            icon={card.icon}
            highlight={card.data.key == selectedPlan}
            button={
              !showSelectors || card.data.numericPrice > 0 ? (
                <></>
              ) : (
                <Button
                  onClick={() => {
                    setSelectedPlan(card.data.key);
                    if (updateGroupPlan !== undefined) {
                      updateGroupPlan(card.data.key);
                    }
                  }}
                  isDisabled={card.data.key == selectedPlan}
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
