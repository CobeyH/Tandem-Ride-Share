import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Button,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { HiMenu } from "react-icons/all";
import * as React from "react";
import { NavConstants } from "../../NavigationConstants";
import { styleColors } from "../../theme/colours";
import { useNavigate } from "react-router-dom";
import LogoName from "./LogoName";

const ProductHeader = ({
  scrollToProducts,
  scrollToTestimonials,
  scrollToAboutUs,
  scrollToContactUs,
}: {
  scrollToProducts: () => void;
  scrollToTestimonials: () => void;
  scrollToAboutUs: () => void;
  scrollToContactUs: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <Box as="nav" bg={styleColors.mainBlue} p={4} textAlign="center">
      <HStack>
        <LogoName />
        <Spacer />
        {/* base: Hamburger Icon */}
        <Box>
          {/* see: https://github.com/chakra-ui/chakra-ui/issues/3173 */}
          <Menu>
            <MenuButton display={{ base: "block", md: "none" }}>
              <Box as={HiMenu} color={"white"} w={6} h={6} />
            </MenuButton>
            <MenuList>
              <MenuGroup title="Features and Benefits">
                <MenuItem onClick={scrollToProducts}>Friend Group</MenuItem>
                <MenuItem onClick={scrollToProducts}>
                  Small Organization
                </MenuItem>
                <MenuItem onClick={scrollToProducts}>
                  Large Organization
                </MenuItem>
                <MenuItem onClick={scrollToProducts}>Enterprise</MenuItem>
              </MenuGroup>
              <MenuGroup title="Company">
                <MenuItem onClick={scrollToTestimonials}>Testimonials</MenuItem>
                <MenuItem onClick={scrollToProducts}>Pricing</MenuItem>
                <MenuItem onClick={scrollToAboutUs}>About Us</MenuItem>
                <MenuItem onClick={scrollToContactUs}>Contact Us</MenuItem>
              </MenuGroup>
              <VStack alignItems="stretch" mx={2} pt={2}>
                <Button
                  variant="tandem-product"
                  borderColor={useColorModeValue(styleColors.deepBlue, "white")}
                  color={useColorModeValue(styleColors.deepBlue, "white")}
                  p={4}
                  onClick={() => navigate(NavConstants.LOGIN)}
                >
                  Login
                </Button>
                <Button
                  variant="tandem-product"
                  borderColor={useColorModeValue(styleColors.deepBlue, "white")}
                  color={useColorModeValue(styleColors.deepBlue, "white")}
                  p={4}
                  onClick={() => navigate(NavConstants.REGISTER)}
                >
                  Register Now
                </Button>
              </VStack>
            </MenuList>
          </Menu>
        </Box>
        {/* md: Navbar */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          <Box>
            {/* see: https://github.com/chakra-ui/chakra-ui/issues/3173 */}
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton color="white">
                    Features and Benefits
                    {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={scrollToProducts}>Friend Group</MenuItem>
                    <MenuItem onClick={scrollToProducts}>
                      Small Organization
                    </MenuItem>
                    <MenuItem onClick={scrollToProducts}>
                      Large Organization
                    </MenuItem>
                    <MenuItem onClick={scrollToProducts}>Enterprise</MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          </Box>
          <Box>
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton color="white">
                    Company {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={scrollToTestimonials}>
                      Testimonials
                    </MenuItem>
                    <MenuItem onClick={scrollToProducts}>Pricing</MenuItem>
                    <MenuItem onClick={scrollToAboutUs}>About Us</MenuItem>
                    <MenuItem onClick={scrollToContactUs}>Contact Us</MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          </Box>
          <Box>
            <Button
              variant="tandem-product"
              p={4}
              onClick={() => navigate(NavConstants.REGISTER)}
            >
              Register Now
            </Button>
          </Box>
          <Box>
            <Button
              variant="tandem-product"
              p={4}
              onClick={() => navigate(NavConstants.LOGIN)}
            >
              Login
            </Button>
          </Box>
        </HStack>
      </HStack>
    </Box>
  );
};

export default ProductHeader;
