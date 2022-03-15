import { ComponentStyleConfig } from "@chakra-ui/theme";
import { lightTheme, styleColors } from "../colours";

export const Input: ComponentStyleConfig = {
  // 3. We can add a new visual variant
  variants: {
    "tandem-base": {
      field: {
        bg: lightTheme.form,
        color: "black",
        _placeholder: { color: "black" },
      },
    },
    "tandem-registration": {
      field: {
        bg: lightTheme.form,
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
