import { ComponentStyleConfig } from "@chakra-ui/theme";
import { lightTheme, styleColors } from "../colours";

const Button: ComponentStyleConfig = {
  variants: {
    "tandem-base": {
      bg: lightTheme.lightButton,
      textColor: lightTheme.buttonText,
    },
    "tandem-product": {
      bg: "",
      textColor: "white",
      border: "2px",
      color: "white",
      _hover: { bg: styleColors.lightBlue },
    },
  },
  defaultProps: {
    variant: "tandem-base",
  },
};

export default Button;
