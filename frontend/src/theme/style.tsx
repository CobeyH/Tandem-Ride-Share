// theme.ts

// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { Dict } from "@chakra-ui/utils";
import { lightTheme } from "./colours";
// Component Styles
import Button from "./components/button";
import { Input } from "./components/input";
import "@fontsource/montserrat";

const styles = {
  styles: {
    global: (props: Dict) => ({
      body: {
        fontFamily: "Montserrat",
        color: mode("gray.800", "whiteAlpha.900")(props),
        bg: mode(lightTheme.main, "gray.800")(props),
        lineHeight: "base",
      },
    }),
  },
  components: {
    Button,
    Input,
  },
};

// 3. extend the theme
const extendedTheme = extendTheme(styles);

export default extendedTheme;
