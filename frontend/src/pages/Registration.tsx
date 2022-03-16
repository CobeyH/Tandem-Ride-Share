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
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };
  const navigate = useNavigate();
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
    <Container bg="white" height="100vh">
      <VStack align="center" p={6} mb={30}>
        <Image
          src={"/logo_mainBlue.svg"}
          alt="main blue logo"
          objectFit="cover"
          maxW="100px"
        />
        <Text color={styleColors.mainBlue}>TANDEM</Text>
      </VStack>
      <VStack>
        <Box
          color={styleColors.mainBlue}
          fontWeight="medium"
          fontSize="175%"
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
        <PasswordField setPassword={setPassword} />
        <Button
          width="30%"
          fontSize="80%"
          mt={4}
          onClick={register}
          variant="tandem-registration"
        >
          Create Account
        </Button>
        <Box pt={10} pb={2} color={styleColors.deepBlue}>
          Or create an account with
        </Box>
        <ProviderAuth />
        <Box>
          Already have an account?{" "}
          <Link
            style={{ color: styleColors.mainBlue, fontWeight: "bold" }}
            to={NavConstants.LOGIN}
            state={location.state}
          >
            Login
          </Link>{" "}
          now.
        </Box>
      </VStack>
    </Container>
  );
}
export default Register;
