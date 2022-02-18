import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase";
import Header from "../components/Header";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Heading,
  Container,
  VStack,
} from "@chakra-ui/react";
import { FaGoogle } from "react-icons/all";
import { LocationGotoState } from "./JoinGroup";
import { NavConstants } from "../NavigationConstants";
import { lightTheme } from "../theme/colours";
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
    <Container bg={lightTheme.main} height="100vh">
      <Header />
      <Box textAlign="center">
        <Heading>Registration</Heading>
      </Box>
      <VStack>
        <FormControl mt={6} isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            type="fullName"
            placeholder="Full name"
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl mt={6} isRequired>
          <FormLabel>E-mail Address</FormLabel>
          <Input
            type="email"
            placeholder="test@test.com"
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl mt={6} isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </FormControl>
        <Button width="full" mt={4} onClick={register}>
          Register
        </Button>
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
