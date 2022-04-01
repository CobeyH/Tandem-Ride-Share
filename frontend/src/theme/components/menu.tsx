import type { ComponentStyleConfig } from "@chakra-ui/theme";

const Menu: ComponentStyleConfig = {
  parts: ["groupTitle"],
  baseStyle: {
    groupTitle: {
      fontSize: "lg",
      textAlign: "left",
      mx: "0.8rem",
    },
  },
};

export default Menu;
