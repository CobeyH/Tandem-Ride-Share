import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Container,
} from "@chakra-ui/react";
import {
  signInWithGoogle,
  auth,
  loginWithEmailAndPassword,
} from "../firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../components/Header";
import { FaGoogle } from "react-icons/all";
import { LocationGotoState } from "./JoinGroup";
import { lightTheme } from "../theme/colours";
import SignInRegister from "../components/SignInRegister";
export default function Login() {
  const location = useLocation();

  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  // If the user is signed in, go to the home page.
  useEffect(() => {
    if (loading) return;
    if (user) {
      // goto is possibly set by JoinGroup in the case the user was sent a link but was not logged in
      const state = location?.state as LocationGotoState;
      let link: string;
      if (state?.goto) {
        link = state?.goto;
      } else {
        link = "/";
      }
      return navigate(link);
    }
  }, [user, loading]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = () => {
    loginWithEmailAndPassword(email, password);
  };

  return (
    <Container bg={lightTheme.main} height="100vh">
      <Header />
      <Box textAlign="center">
        <Heading>Login</Heading>
      </Box>
      <Box>
        <FormControl mt={6} isRequired>
          <FormLabel>E-mail Address</FormLabel>
          <Input
            type="email"
            color="white"
            _placeholder={{ color: "white" }}
            placeholder="test@test.com"
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl mt={6} isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            color="white"
            _placeholder={{ color: "white" }}
            placeholder="*******"
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </FormControl>
        <SignInRegister
          onClickSignIn={handleEmailLogin}
          state={location.state as LocationGotoState}
        />
        <Button
          leftIcon={<FaGoogle />}
          width="full"
          mt={4}
          onClick={signInWithGoogle}
        >
          Sign In With Google
        </Button>
      </Box>
    </Container>
  );
}
