import React from "react";
import { Button, Center, Flex, VStack } from "@chakra-ui/react";
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
        <VStack pt={2} align="stretch" spacing={3}>
          <Button
            mt={4}
            onClick={
              onClickSignIn
                ? onClickSignIn
                : () => {
                    navigate("/login", { state });
                  }
            }
          >
            Sign In
          </Button>
        </VStack>
      </Flex>
    </Center>
  );
}
