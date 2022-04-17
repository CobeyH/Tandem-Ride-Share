import React from "react";
import { Button, Center, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LocationGotoState } from "../pages/JoinGroup";

export default function SignInRegister({
  state,
  onClickSignIn,
}: {
  state?: LocationGotoState;
  onClickSignIn?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <Center>
      <Flex>
        <Button
          onClick={
            onClickSignIn
              ? onClickSignIn
              : () => {
                  navigate("/login", { state });
                }
          }
          variant="tandem-login"
          data-cy="auth-submit"
        >
          Sign in
        </Button>
      </Flex>
    </Center>
  );
}
