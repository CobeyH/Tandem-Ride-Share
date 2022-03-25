import {
  FormControl,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { styleColors } from "../theme/colours";

const PasswordField = (props: {
  setPassword: (newPass: string) => void;
  passVariant: string;
  submitHandler: () => void;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <FormControl mt={10} width={"85%"} maxW={"85%"}>
      <InputGroup>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={(event) => props.setPassword(event.currentTarget.value)}
          variant={props.passVariant}
          onKeyDown={(ev) => {
            if (ev.key == "Enter") {
              props.submitHandler();
            }
          }}
        />
        <InputRightElement h="100%">
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            icon={showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            aria-label="password-visability"
            color={styleColors.darkBlue}
            variant="ghost"
          />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};

export default PasswordField;
