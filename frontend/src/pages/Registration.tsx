import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase/firebase";
import Header from "../components/Header";
import {
  FormControl,
  Input,
  Button,
  Box,
  Heading,
  Container,
  VStack,
  Tooltip,
} from "@chakra-ui/react";
import { FaGoogle } from "react-icons/all";
import { LocationGotoState } from "./JoinGroup";
import { NavConstants } from "../NavigationConstants";
import { lightTheme } from "../theme/colours";
import PasswordField from "../components/PasswordField";
function Register() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading] = useAuthState(auth);
  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };
  const navigate = useNavigate();

  // checking validity of the input
  const validName = !!name;
  const validEmail = email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  const MIN_PASSWORD_LENGTH = 6;
  const validPassword = password.length >= MIN_PASSWORD_LENGTH;
  const isFormValid = validName && validEmail && validPassword;
  const checkMark = "✔";
  const crossMark = "❌";
  const tooltipContents = (
    <div>
      {validName ? checkMark : crossMark} Name is required
      <br />
      {validEmail ? checkMark : crossMark} Valid email address is required
      <br />
      {validPassword ? checkMark : crossMark} Password needs to be at least 6
      characters
    </div>
  );

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
  return (
    <Container bg={lightTheme.main} height="100vh">
      <Header />
      <Box textAlign="center">
        <Heading>Registration</Heading>
      </Box>
      <VStack>
        <FormControl mt={6} isRequired>
          <Input
            type="fullName"
            placeholder="Full Name"
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl mt={6} isRequired>
          <Input
            type="email"
            placeholder="Email Address"
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </FormControl>
        <PasswordField setPassword={setPassword} />
        <Tooltip hasArrow label={tooltipContents} shouldWrapChildren>
          <Button
            width="full"
            mt={4}
            onClick={register}
            disabled={!isFormValid}
          >
            Register
          </Button>
        </Tooltip>
        <Button
          mt={4}
          leftIcon={<FaGoogle />}
          width="full"
          onClick={signInWithGoogle}
        >
          Register with Google
        </Button>
        <div>
          Already have an account?{" "}
          <Link
            style={{ color: "blue" }}
            to={NavConstants.LOGIN}
            state={location.state}
          >
            Login
          </Link>{" "}
          now.
        </div>
      </VStack>
    </Container>
  );
}
export default Register;
