import React from "react";
import { Button, Center, Flex, Text, VStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { LocationGotoState } from "../pages/JoinGroup";
import { FaGoogle } from "react-icons/all";
import { signInWithGoogle } from "../firebase/firebase";

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
        <VStack pt={5} align="stretch" spacing={3}>
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
          <Button leftIcon={<FaGoogle />} mt={4} onClick={signInWithGoogle}>
            Sign In With Google
          </Button>
          <Text>
            New to Tandem?{" "}
            <Link style={{ color: "blue" }} to="/register" state={state}>
              Register
            </Link>
          </Text>
        </VStack>
      </Flex>
    </Center>
  );
}
