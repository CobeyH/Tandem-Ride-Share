import { ComponentStyleConfig } from "@chakra-ui/theme";
import { lightTheme } from "../colours";

export const Input: ComponentStyleConfig = {
  // 3. We can add a new visual variant
  variants: {
    "tandem-base": {
      field: {
        bg: lightTheme.form,
      },
    },
  },
  defaultProps: {
    variant: "tandem-base",
  },
};
