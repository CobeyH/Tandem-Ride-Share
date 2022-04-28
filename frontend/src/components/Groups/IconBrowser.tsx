import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { IconType } from "react-icons";
import * as icons from "react-icons/gi";
import { ImSearch } from "react-icons/im";
import { styleColors } from "../../theme/colours";
import { FaCaretRight, FaCaretLeft } from "react-icons/fa";

const IconBrowser = (props: {
  icon: string;
  updateIcon: (icon: string) => void;
}) => {
  const [startIndx, setStartIndx] = useState<number>(0);
  const [searchInput, setSearchInput] = useState("");
  const numPerPage = 25;

  const filteredIcons = useMemo(
    () =>
      Object.keys(icons).filter((key) =>
        key
          .toLowerCase()
          .includes(searchInput.toLowerCase().replace(/\s+/g, ""))
      ),
    [searchInput, icons]
  );

  return (
    <VStack alignItems="center" spacing={2} w="100%">
      <InputGroup>
        <Input
          onChange={(e) => {
            setSearchInput(e.currentTarget.value);
            setStartIndx(0);
          }}
          data-cy="icon-search-filter"
        />
        <InputLeftElement>
          <ImSearch color={styleColors.deepBlue} />
        </InputLeftElement>
      </InputGroup>

      <HStack alignItems="center" pt={2} pb={2}>
        <IconButton
          variant="tandem-nextPrev"
          icon={<FaCaretLeft />}
          isRound
          isDisabled={startIndx < numPerPage}
          onClick={() => setStartIndx(startIndx - numPerPage)}
          aria-label={"next page"}
        />
        <IconButton
          variant="tandem-nextPrev"
          icon={<FaCaretRight />}
          isRound
          isDisabled={startIndx + numPerPage + 1 > filteredIcons.length}
          onClick={() => setStartIndx(startIndx + numPerPage)}
          aria-label={"prev page"}
        />
      </HStack>

      <SimpleGrid
        columns={{ base: 4, md: 5 }}
        spacing={{ base: 2, sm: 4, md: 6 }}
      >
        {filteredIcons.slice(startIndx, startIndx + 25).map((key) => (
          <IconButton
            key={key}
            aria-label={key}
            variant="tandem-icons"
            boxSize={{ base: "30px", sm: "40px", md: "50px", lg: "60px" }}
            bg={key == props.icon ? styleColors.mint : styleColors.lightBlue}
            border={key == props.icon ? "4px" : "0px"}
            borderColor={
              key == props.icon
                ? useColorModeValue(styleColors.mainBlue, styleColors.medBlue)
                : "transparent"
            }
            as={(icons as { [k: string]: IconType })[key]}
            isRound
            p={1}
            onClick={() => {
              props.updateIcon(key);
            }}
            data-cy="icon-option"
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};
export default IconBrowser;
