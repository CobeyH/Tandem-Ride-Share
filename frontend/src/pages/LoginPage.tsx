import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  FormControl,
  Input,
  Container,
  Text,
} from "@chakra-ui/react";
import { auth, loginWithEmailAndPassword } from "../firebase/firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../components/Header";
import { LocationGotoState } from "./JoinGroup";
import { lightTheme } from "../theme/colours";
import SignInRegister from "../components/SignInRegister";
import PasswordField from "../components/PasswordField";

export default function Login({ state }: { state?: LocationGotoState }) {
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
          <Input
            type="email"
            placeholder="Email"
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </FormControl>
        <PasswordField setPassword={setPassword} />
        <SignInRegister
          onClickSignIn={handleEmailLogin}
          state={location.state as LocationGotoState}
        />
      </Box>
      <Text>
        New to Tandem?{" "}
        <Link style={{ color: "blue" }} to="/register" state={state}>
          Register
        </Link>
      </Text>
    </Container>
  );
}
