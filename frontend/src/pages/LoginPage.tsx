import React, { useState, useEffect } from "react";
import {
  Text,
  Box,
  Heading,
  FormControl,
  Input,
  Container,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  InputGroup,
  InputLeftElement,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  useToast,
} from "@chakra-ui/react";
import {
  auth,
  loginWithEmailAndPassword,
  sendPasswordReset,
} from "../firebase/firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../components/Header";
import { LocationGotoState } from "./JoinGroup";
import { lightTheme } from "../theme/colours";
import SignInRegister from "../components/SignInRegister";
import PasswordField from "../components/PasswordField";
import { MdMail } from "react-icons/all";
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
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        <Text textAlign={"right"}>
          Forgot Password?{" "}
          <Link style={{ color: "blue" }} onClick={onOpen} to={"#"}>
            Reset
          </Link>
        </Text>
        <ResetPasswordModal
          isOpen={isOpen}
          onClose={onClose}
          email={email}
          setEmail={setEmail}
        />
        <SignInRegister
          onClickSignIn={handleEmailLogin}
          state={location.state as LocationGotoState}
        />
      </Box>
    </Container>
  );
}

const ResetPasswordModal = ({
  isOpen,
  onClose,
  setEmail,
  email,
}: {
  isOpen: boolean;
  onClose: () => void;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  email: string;
}) => {
  const toast = useToast();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reset Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Email</Text>
          <InputGroup>
            <Input
              type={"email"}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <InputLeftElement>
              <MdMail />
            </InputLeftElement>
          </InputGroup>
          <Text p={4}>
            We will send a password reset to your email, give it a couple
            minutes to show up.
          </Text>
          <Button
            p={4}
            onClick={() =>
              sendPasswordReset(email).then(() => {
                toast({
                  title: "Password Reset Email Sent!",
                  status: "success",
                  description: "It may take a second to show up.",
                });
                onClose();
              })
            }
          >
            Reset Password
          </Button>
        </ModalBody>
      </ModalContent>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onClose}>
          Close
        </Button>
        <Button variant="ghost">Secondary Action</Button>
      </ModalFooter>
    </Modal>
  );
};
