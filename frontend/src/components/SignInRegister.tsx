import React from "react";
import { Button, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { LocationGotoState } from "../pages/JoinGroup";

export default function SignInRegister({
  state,
  onClickSignIn,
}: {
  state?: LocationGotoState;
  onClickSignIn?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <>
      <Button
        width="full"
        mt={4}
        onClick={
          onClickSignIn
            ? onClickSignIn
            : () => {
                navigate("/login", { state });
              }
        }
      >
        Sign In
      </Button>
      <Text>
        New to Tandem?{" "}
        <Link style={{ color: "blue" }} to="/register" state={state}>
          Register
        </Link>{" "}
      </Text>
    </>
  );
}
