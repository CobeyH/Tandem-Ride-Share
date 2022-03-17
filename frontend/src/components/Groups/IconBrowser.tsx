import {
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IconType } from "react-icons";
import * as icons from "react-icons/gi";
import { ImSearch } from "react-icons/im";
import { styleColors } from "../../theme/colours";

const IconBrowser = (props: {
  icon: string;
  updateIcon: (icon: string) => void;
}) => {
  const [startIndx, setStartIndx] = useState<number>(0);
  const [searchInput, setSearchInput] = useState("");
  const numPerPage = 25;
  const filteredIcons = Object.keys(icons).filter((key: string) =>
    key.toLowerCase().includes(searchInput.toLowerCase().replace(/\s+/g, ""))
  );
  return (
    <VStack py={5} alignItems="center" spacing={3} w="100%">
      <InputGroup>
        <Input
          onChange={(e) => {
            setSearchInput(e.currentTarget.value);
            setStartIndx(0);
          }}
        />
        <InputLeftElement>
          <ImSearch color={styleColors.deepBlue} />
        </InputLeftElement>
      </InputGroup>

      <SimpleGrid columns={5} spacing={5} w="100%">
        {filteredIcons.slice(startIndx, startIndx + 25).map((key: string) => {
          return (
            <IconButton
              key={key}
              aria-label={key}
              w="100%"
              h="100%"
              bg={key == props.icon ? styleColors.mint : styleColors.lightBlue}
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
          isDisabled={startIndx + numPerPage + 1 > filteredIcons.length}
          onClick={() => setStartIndx(startIndx + numPerPage)}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );
};
export default IconBrowser;
