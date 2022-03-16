import React from "react";
import { HStack, IconButton } from "@chakra-ui/react";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signInWithProvider } from "../firebase/firebase";

export default function ProviderAuth(props: { buttonVar: string }) {
  return (
    <HStack spacing={2} pb={4} align="center">
      <IconButton
        icon={<FcGoogle />}
        isRound
        aria-label="Google-signin"
        onClick={() => signInWithProvider(new GoogleAuthProvider(), "google")}
        variant={props.buttonVar}
      ></IconButton>
      <IconButton
        icon={<FaFacebookF color="#1877F2" />}
        isRound
        aria-label="Facebook-signin"
        onClick={() =>
          signInWithProvider(new FacebookAuthProvider(), "facebook")
        }
        variant={props.buttonVar}
      ></IconButton>
    </HStack>
  );
}
