import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase";
import Header from "./Header";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Heading,
} from "@chakra-ui/react";
import { FaGoogle } from "react-icons/all";
function Register() {
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
    if (user) return navigate("/");
  }, [user, loading]);
  return (
    <div className="register">
      <Header />
      <Box textAlign="center">
        <Heading>Registration</Heading>
      </Box>
      <Flex width="full" align="center" justifyContent="center">
        <div className="register__container">
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
            <Link style={{ color: "blue" }} to="/">
              Login
            </Link>{" "}
            now.
          </div>
        </div>
      </Flex>
    </div>
  );
}
export default Register;
