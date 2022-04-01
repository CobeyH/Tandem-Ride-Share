// theme.ts

// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { Dict } from "@chakra-ui/utils";
// Component Styles
import Button from "./components/button";
import Text from "./components/text";
import { Input } from "./components/input";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import Heading from "./components/heading";

const styles = {
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
  styles: {
    global: (props: Dict) => ({
      body: {
        fontFamily: "body",
        color: mode("gray.800", "whiteAlpha.900")(props),
        //bg: mode(lightTheme.main, "gray.800")(props),
        lineHeight: "base",
      },
    }),
  },
  components: {
    Button,
    Input,
    Text,
    Heading,
    Steps,
  },
  fonts: {
    heading: "Montserrat",
    body: "Montserrat",
  },
};

// 3. extend the theme
const extendedTheme = extendTheme(styles);

export default extendedTheme;
