import { ComponentStyleConfig } from "@chakra-ui/theme";
import { lightTheme, styleColors } from "../colours";

const Button: ComponentStyleConfig = {
  variants: {
    "tandem-base": {
      bg: styleColors.paleBlue,
      textColor: styleColors.deepBlue,
    },
    "tandem-product": {
      bg: "",
      textColor: "white",
      border: "2px",
      color: "white",
      _hover: { bg: styleColors.paleBlue },
    },
  },
  defaultProps: {
    variant: "tandem-base",
  },
};

export default Button;
