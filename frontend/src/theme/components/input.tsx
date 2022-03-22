import { ComponentStyleConfig } from "@chakra-ui/theme";
import { darkTheme, lightTheme, styleColors } from "../colours";
import { mode } from "@chakra-ui/theme-tools";

export const Input: ComponentStyleConfig = {
  // 3. We can add a new visual variant
  variants: {
    "tandem-base": (props) => ({
      field: {
        bg: mode(lightTheme.form, darkTheme.form)(props),
        color: mode("black", "white")(props),
        _placeholder: { color: mode("black", "white")(props) },
      },
    }),
    "tandem-registration": (props) => ({
      field: {
        bg: mode(lightTheme.form, darkTheme.form)(props),
        color: styleColors.darkBlue,
        fontWeight: "medium",
        p: 6,
        _placeholder: { color: styleColors.darkBlue, fontWeight: "medium" },
      },
    }),
    "tandem-login": {
      field: {
        bg: "white",
        color: styleColors.darkBlue,
        fontWeight: "medium",
        p: 6,
        _placeholder: { color: styleColors.darkBlue, fontWeight: "medium" },
      },
    },
  },
  defaultProps: {
    variant: "tandem-base",
  },
};
