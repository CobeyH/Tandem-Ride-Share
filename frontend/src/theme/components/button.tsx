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
      p: 4,
      _hover: { bg: styleColors.paleBlue },
    },
    "tandem-login": {
      bg: styleColors.darkBlue,
      textColor: "white",
      fontWeight: "semiBold",
      color: "white",
      _hover: { bg: styleColors.lightBlue },
    },
    "tandem-loginProv": {
      bg: "white",
      textColor: styleColors.darkBlue,
      fontWeight: "semiBold",
      _hover: { bg: styleColors.lightBlue },
    },
    signInWith: {
      bg: styleColors.paleBlue,
      textColor: "white",
      fontWeight: "semiBold",
      color: styleColors.medBlue,
      _hover: {
        bg: styleColors.lightBlue,
        color: styleColors.darkBlue,
      },
    },
  },
  defaultProps: {
    variant: "tandem-base",
  },
};

export default Button;
