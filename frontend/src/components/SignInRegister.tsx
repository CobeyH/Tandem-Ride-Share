import React from "react";
import { Button, Center, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { LocationGotoState } from "../pages/JoinGroup";
import { FaFacebookF, FcGoogle } from "react-icons/all";
import { signInWithProvider } from "../firebase/firebase";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

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
          <HStack spacing={2} pb={4}>
            <Button
              leftIcon={<FcGoogle />}
              width="full"
              onClick={() =>
                signInWithProvider(new GoogleAuthProvider(), "google")
              }
              variant="signInWith"
            >
              Google
            </Button>
            <Button
              leftIcon={<FaFacebookF color="#1877F2" />}
              width="full"
              onClick={() =>
                signInWithProvider(new FacebookAuthProvider(), "facebook")
              }
              variant="signInWith"
            >
              Facebook
            </Button>
          </HStack>
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
