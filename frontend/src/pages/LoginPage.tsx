import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Input,
  Container,
  Text,
  VStack,
  Image,
  Center,
} from "@chakra-ui/react";
import { auth, loginWithEmailAndPassword } from "../firebase/firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { LocationGotoState } from "./JoinGroup";
import { styleColors } from "../theme/colours";
import SignInRegister from "../components/SignInRegister";
import PasswordField from "../components/PasswordField";
import ProviderAuth from "../components/ProviderAuth";

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
    <Box bg={styleColors.mainBlue}>
      <Container height="100vh">
        <VStack align="center" p={6} mb={30}>
          <Image
            src={"/logo_white.svg"}
            alt="main blue logo"
            objectFit="cover"
            maxW="100px"
          />
          <Text color="white">TANDEM</Text>
        </VStack>
        <Box
          textAlign="center"
          fontSize="200%"
          color="white"
          fontWeight="medium"
        >
          Sign in
        </Box>
        <Center>
          <VStack spacing={3} mb={5}>
            <FormControl mt={10} pb={5} width={"85%"} maxW={"85%"} isRequired>
              <Input
                type="email"
                placeholder="Email"
                onChange={(event) => setEmail(event.currentTarget.value)}
                variant="tandem-login"
              />
            </FormControl>
            <PasswordField
              setPassword={setPassword}
              passVariant="tandem-login"
            />
            <SignInRegister
              onClickSignIn={handleEmailLogin}
              state={location.state as LocationGotoState}
            />
            <Box pt={10} pb={2} color="white" textAlign="center">
              Or sign in with
            </Box>
            <ProviderAuth buttonVar="tandem-loginProv" />
            <Text textAlign="center" color="white">
              New to Tandem?{" "}
              <Link
                style={{ color: "white", fontWeight: "bold" }}
                to="/register"
                state={state}
              >
                Register
              </Link>
            </Text>
          </VStack>
        </Center>
      </Container>
    </Box>
  );
}
