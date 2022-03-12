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

const PasswordField = (props: { setPassword: (newPass: string) => void }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <FormControl mt={6} isRequired>
      <InputGroup>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={(event) => props.setPassword(event.currentTarget.value)}
        />
        <InputRightElement>
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            icon={showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            aria-label="password-visability"
            variant="ghost"
          />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};

export default PasswordField;
