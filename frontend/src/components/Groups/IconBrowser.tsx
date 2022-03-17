import { Box, Button, HStack, Icon, SimpleGrid } from "@chakra-ui/react";
import React, { useState } from "react";
import { IconType } from "react-icons";
import * as icons from "react-icons/gi";

const IconBrowser = () => {
  const [startIndx, setStartIndx] = useState<number>(0);
  const numPerPage = 25;
  return (
    <Box p={5}>
      <SimpleGrid columns={5} spacing={5}>
        {Object.keys(icons)
          .slice(startIndx, startIndx + 25)
          .map((key: string) => {
            console.log(key);
            return (
              <Icon
                key={key}
                aria-label={key}
                w="100%"
                h="100%"
                as={(icons as { [k: string]: IconType })[key]}
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
    </Box>
  );
};
export default IconBrowser;
