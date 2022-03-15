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
  Stack,
} from "@chakra-ui/react";
import {
  auth,
  loginWithEmailAndPassword,
  sendPasswordReset,
} from "../firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../components/Header";
import { LocationGotoState } from "./JoinGroup";
import { lightTheme } from "../theme/colours";
import SignInRegister from "../components/SignInRegister";
import PasswordField from "../components/PasswordField";
import { MdMail } from "react-icons/all";
import { confirmPasswordReset } from "firebase/auth";
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
        <ResetPasswordModal
          isOpen={isOpen}
          onClose={onClose}
          email={email}
          setEmail={setEmail}
        />
        <SignInRegister
          onClickSignIn={handleEmailLogin}
          onClickForgotPassword={onOpen}
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
  const [resetCode, setResetCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reset Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {emailSent ? (
            <Stack spacing={3}>
              <Input
                placeholder={"Reset code"}
                type={"text"}
                value={resetCode}
                onChange={(e) => setResetCode(e.currentTarget.value)}
              />
              <Input
                placeholder={"New password"}
                type={"password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.currentTarget.value)}
              />
              <Input
                placeholder={"Confirm New password"}
                type={"password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.currentTarget.value)}
              />
              <Button
                disabled={
                  newPassword !== confirmNewPassword &&
                  confirmNewPassword.length >= 6
                }
                onClick={() => {
                  confirmPasswordReset(auth, resetCode, newPassword)
                    .then(() => {
                      toast({
                        title: "Password Reset!",
                        status: "success",
                      });
                      onClose();
                    })
                    .catch((err) => {
                      toast({
                        title: "Something Went Wrong",
                        status: "error",
                        description: err.code,
                      });
                    });
                }}
              >
                Submit
              </Button>
            </Stack>
          ) : (
            <>
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
                    setEmailSent(true);
                  })
                }
              >
                Reset Password
              </Button>
            </>
          )}
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
