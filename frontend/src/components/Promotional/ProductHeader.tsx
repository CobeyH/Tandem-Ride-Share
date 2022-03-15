import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Stack,
  HStack,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { HiMenu } from "react-icons/all";
import * as React from "react";
import { NavConstants } from "../../NavigationConstants";
import { styleColors } from "../../theme/colours";
import { useNavigate } from "react-router-dom";

const ProductHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());
  const navigate = useNavigate();

  return (
    <Box as="nav" bg={styleColors.mainBlue} p={4} textAlign="center">
      <Stack direction={{ base: "column", md: "row" }}>
        <HStack>
          <Image src={"/logo_white.svg"} objectFit="cover" maxW="70px" />
          <Text color="white" fontSize={30} p={1}>
            Tandem
          </Text>
          <Spacer />
          <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
            <HiMenu />
          </Box>
        </HStack>
        <Spacer />
        <HStack
          spacing={4}
          display={{ base: isOpen ? "flex" : "none", md: "flex" }}
        >
          <Menu>
            <MenuButton color="white">
              Features and Benefits
              <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              <MenuItem>Friend Group</MenuItem>
              <MenuItem>Small Organization</MenuItem>
              <MenuItem>Large Organization</MenuItem>
              <MenuItem>Enterprise</MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton color="white">
              Company
              <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              <MenuItem>Testimonials</MenuItem>
              <MenuItem>Pricing</MenuItem>
              <MenuItem>About Us</MenuItem>
              <MenuItem>Contact Us</MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton color="white">
              Help
              <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              <MenuItem>FAQ</MenuItem>
              <MenuItem>Privacy Policy</MenuItem>
              <MenuItem>Legal</MenuItem>
              <MenuItem>Terms of Service</MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        <HStack
          spacing={4}
          pl={4}
          display={{ base: isOpen ? "block" : "none", md: "flex" }}
        >
          <Button
            variant="tandem-product"
            p={4}
            onClick={() => navigate(NavConstants.REGISTER)}
          >
            Register Now
          </Button>
          <Button
            variant="tandem-product"
            p={4}
            onClick={() => navigate(NavConstants.LOGIN)}
          >
            Login
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};

export default ProductHeader;