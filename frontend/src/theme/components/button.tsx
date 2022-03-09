import { ComponentStyleConfig } from "@chakra-ui/theme";
import { lightTheme } from "../colours";

const Button: ComponentStyleConfig = {
  variants: {
    "tandem-base": {
      bg: lightTheme.lightButton,
      textColor: lightTheme.buttonText,
    },
    "tandem-registration": {
      bg: "green.200",
      textColor: "white",
    },
  },
  defaultProps: {
    variant: "tandem-base",
  },
};

export default Button;
