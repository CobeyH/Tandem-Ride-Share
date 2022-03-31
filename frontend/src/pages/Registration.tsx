import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword } from "../firebase/firebase";
import {
  FormControl,
  Input,
  Button,
  Box,
  Container,
  VStack,
  Image,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { LocationGotoState } from "./JoinGroup";
import { NavConstants } from "../NavigationConstants";
import { styleColors } from "../theme/colours";
import PasswordField from "../components/PasswordField";
import ProviderAuth from "../components/ProviderAuth";
function Register() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading] = useAuthState(auth);
  const register = () => {
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
        link = "/welcome";
      }
      return navigate(link);
    }
  }, [user, loading]);
  return (
    <Box bg={useColorModeValue("white", styleColors.deepBlue)}>
      <Container height="100vh">
        <VStack align="center" p={6} mb={30}>
          <Image
            src={useColorModeValue("/logo_mainBlue.svg", "/logo_white.svg")}
            alt="main blue logo"
            objectFit="cover"
            maxW="100px"
          />
          <Text color={useColorModeValue(styleColors.mainBlue, "white")}>
            TANDEM
          </Text>
        </VStack>
        <VStack>
          <Box
            color={useColorModeValue(styleColors.mainBlue, "white")}
            fontWeight="medium"
            fontSize="200%"
            mb={4}
          >
            Register
          </Box>
          <FormControl mt={10} pb={5} width={"85%"} maxW={"85%"} isRequired>
            <Input
              type="fullName"
              placeholder="Full Name"
              onChange={(event) => setName(event.currentTarget.value)}
              variant="tandem-registration"
            />
          </FormControl>
          <FormControl mt={10} pb={5} width={"85%"} maxW={"85%"} isRequired>
            <Input
              type="email"
              placeholder="Email Address"
              onChange={(event) => setEmail(event.currentTarget.value)}
              variant="tandem-registration"
            />
          </FormControl>
          <PasswordField
            setPassword={setPassword}
            passVariant="tandem-registration"
            submitHandler={register}
          />
          <Tooltip hasArrow label={tooltipContents} shouldWrapChildren>
            <Button
              onClick={register}
              disabled={!isFormValid}
              mt={5}
              variant="tandem-registration"
            >
              Create Account
            </Button>
          </Tooltip>
          <Box
            pt={10}
            pb={2}
            color={useColorModeValue(styleColors.deepBlue, "white")}
          >
            Or create an account with
          </Box>
          <ProviderAuth buttonVar="signInWith" />
          <Box>
            Already have an account?{" "}
            <Link
              style={{
                color: useColorModeValue(styleColors.mainBlue, "white"),
                fontWeight: "bold",
              }}
              to={NavConstants.LOGIN}
              state={location.state}
            >
              Login
            </Link>{" "}
            now.
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
export default Register;
