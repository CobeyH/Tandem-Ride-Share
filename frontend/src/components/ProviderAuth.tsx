import React from "react";
import { HStack, Button } from "@chakra-ui/react";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signInWithProvider } from "../firebase/firebase";

export default function ProviderAuth() {
  return (
    <HStack spacing={2} pb={4}>
      <Button
        leftIcon={<FcGoogle />}
        width="full"
        onClick={() => signInWithProvider(new GoogleAuthProvider(), "google")}
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
  );
}
