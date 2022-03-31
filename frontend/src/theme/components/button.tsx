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
      bgColor: styleColors.checkmarkGreen,
      _hover: { bg: styleColors.medGreen },
    },
    "tandem-group": {
      bg: "transparent",
      _hover: {
        _before: {
          content: `""`,
          position: "absolute",
          left: "2px",
          width: "6px",
          height: "100%",
          borderRadius: "3px",
          bg: styleColors.paleBlue,
        },
      },
      _focus: {
        boxShadow: "none",
        _before: {
          content: `""`,
          position: "absolute",
          left: "2px",
          width: "6px",
          height: "100%",
          borderRadius: "3px",
          bg: styleColors.paleBlue,
        },
      },
    },
    "tandem-group-current": {
      bg: "transparent",
      _before: {
        content: `""`,
        position: "absolute",
        left: "2px",
        width: "6px",
        height: "100%",
        borderRadius: "3px",
        bg: styleColors.darkBlue,
      },
      _focus: {
        boxShadow: "none",
      },
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
