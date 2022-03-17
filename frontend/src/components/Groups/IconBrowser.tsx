import {
  Button,
  HStack,
  IconButton,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IconType } from "react-icons";
import * as icons from "react-icons/gi";

const IconBrowser = (props: {
  icon: string;
  updateIcon: (icon: string) => void;
}) => {
  const [startIndx, setStartIndx] = useState<number>(0);
  const numPerPage = 25;
  return (
    <VStack py={5} alignItems="center" spacing={3} w="100%">
      <SimpleGrid columns={5} spacing={5} w="100%">
        {Object.keys(icons)
          .slice(startIndx, startIndx + 25)
          .map((key: string) => {
            return (
              <IconButton
                key={key}
                aria-label={key}
                w="100%"
                h="100%"
                as={(icons as { [k: string]: IconType })[key]}
                isRound
                p={1}
                onClick={() => {
                  props.updateIcon(key);
                }}
              />
            );
          })}
      </SimpleGrid>
      <HStack alignItems="center" pt={5}>
        <Button
          isDisabled={startIndx < numPerPage}
          onClick={() => setStartIndx(startIndx - numPerPage)}
        >
          Prev
        </Button>
        <Button
          isDisabled={startIndx + numPerPage + 1 > Object.keys(icons).length}
          onClick={() => setStartIndx(startIndx + numPerPage)}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );
};
export default IconBrowser;
