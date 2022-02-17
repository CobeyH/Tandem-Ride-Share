// theme.ts

// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { Dict } from "@chakra-ui/utils";
import { lightTheme } from "./colours";
import Button from "./components/button";

const styles = {
  styles: {
    global: (props: Dict<any>) => ({
      body: {
        fontFamily: "body",
        bg: mode(lightTheme.main, "gray.800")(props),
        lineHeight: "base",
      },
    }),
  },
  components: {
    Button,
  },
};

// 3. extend the theme
const extendedTheme = extendTheme(styles);

export default extendedTheme;
