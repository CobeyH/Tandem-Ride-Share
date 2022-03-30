import {
  BoxProps,
  Flex,
  FlexProps,
  Heading,
  Icon,
  List,
  ListIcon,
  ListItem,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { HiCheckCircle } from "react-icons/hi";
import { styleColors } from "../../theme/colours";
import { Card } from "./Card";

export interface PricingCardData {
  features: string[];
  name: string;
  price: string;
}

interface PricingCardProps extends BoxProps {
  data: PricingCardData;
  icon: React.ElementType;
  button: React.ReactElement;
  highlight: boolean;
}

const CardBadge = (props: FlexProps) => {
  const { children, ...flexProps } = props;
  return (
    <Flex
      bg={useColorModeValue("blue.500", "blue.200")}
      position="absolute"
      right={-20}
      top={6}
      width="240px"
      transform="rotate(45deg)"
      py={2}
      justifyContent="center"
      alignItems="center"
      {...flexProps}
    >
      <Text
        fontSize="xs"
        textTransform="uppercase"
        fontWeight="bold"
        letterSpacing="wider"
        color={useColorModeValue("white", "gray.800")}
      >
        {children}
      </Text>
    </Flex>
  );
};

export const PricingCard = (props: PricingCardProps) => {
  const { data, icon, button, highlight, ...rest } = props;
  const { features, price, name } = data;
  const accentColor = useColorModeValue(styleColors.green, styleColors.green);

  return (
    <Card highlight={highlight} rounded={{ sm: "xl" }} {...rest}>
      <VStack spacing={6}>
        <Icon aria-hidden as={icon} fontSize="4xl" color={accentColor} />
        <Heading
          size="md"
          fontWeight="extrabold"
          color={useColorModeValue(styleColors.deepBlue, "white")}
        >
          {name}
        </Heading>
      </VStack>
      <Flex
        align="flex-end"
        justify="center"
        fontWeight="extrabold"
        color={accentColor}
        my="8"
      >
        <Heading
          size="3xl"
          fontWeight="inherit"
          lineHeight="0.9em"
          fontSize={{ base: 30, md: 50 }}
        >
          {price}
        </Heading>
        {price === "Free" ? null : (
          <Text fontWeight="inherit" fontSize={{ base: "sm", md: "xl" }}>
            / month
          </Text>
        )}
      </Flex>
      <List
        spacing="4"
        mb="8"
        maxW="28ch"
        mx="auto"
        color={useColorModeValue(styleColors.deepBlue, styleColors.lightBlue)}
      >
        {features.map((feature, index) => (
          <ListItem fontWeight="medium" key={index}>
            <ListIcon
              fontSize="xl"
              as={HiCheckCircle}
              marginEnd={2}
              color={accentColor}
            />
            {feature}
          </ListItem>
        ))}
      </List>
      {data.price !== "Free" ? <CardBadge> Coming Soon </CardBadge> : null}
      {button}
    </Card>
  );
};
