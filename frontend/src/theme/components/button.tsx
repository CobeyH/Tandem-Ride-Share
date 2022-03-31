import { ComponentStyleConfig } from "@chakra-ui/theme";
import { styleColors } from "../colours";
import { mode } from "@chakra-ui/theme-tools";

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
    "tandem-warning": {
      bg: "red",
      textColor: "white",
    },
    "tandem-registration": (props) => ({
      bg: styleColors.medBlue,
      textColor: "white",
      fontWeight: "semiBold",
      color: "white",
      p: 4,
      _hover: { bg: styleColors.paleBlue },
      _disabled: {
        _hover: { textColor: mode(styleColors.deepBlue, "white")(props) },
      },
    }),
    "tandem-login": {
      bg: styleColors.darkBlue,
      textColor: "white",
      fontWeight: "semiBold",
      color: "white",
      _hover: { bg: styleColors.lightBlue },
    },
    "tandem-loginProv": (props) => ({
      bg: mode("white", styleColors.paleBlue)(props),
      textColor: styleColors.darkBlue,
      fontWeight: "semiBold",
      _hover: { bg: styleColors.lightBlue },
    }),
    "tandem-nextPrev": {
      variant: "ghost",
      textColor: styleColors.darkBlue,
      fontWeight: "semiBold",
      _hover: { bg: styleColors.lightMint },
      _isDisabled: { textColor: styleColors.deepBlue },
    },
    "tandem-submit": {
      textColor: "white",
      fontWeight: "Bold",
      bgColor: styleColors.medGreen,
      _hover: { bg: styleColors.green },
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
