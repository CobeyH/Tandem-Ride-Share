import { ComponentStyleConfig } from "@chakra-ui/theme";
import { styleColors } from "../colours";

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
    "tandem-registration": {
      bg: styleColors.medBlue,
      textColor: "white",
      fontWeight: "semiBold",
      color: "white",
      _hover: { bg: styleColors.paleBlue },
    },
    signInWith: {
      bg: styleColors.paleBlue,
      textColor: "white",
      fontWeight: "semiBold",
      color: styleColors.medBlue,
      _hover: {
        bg: styleColors.lightBlue,
      },
    },
  },
  defaultProps: {
    variant: "tandem-base",
  },
};

export default Button;
