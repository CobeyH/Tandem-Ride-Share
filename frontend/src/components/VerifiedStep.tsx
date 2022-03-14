import { Button, Flex } from "@chakra-ui/react";
import { Step } from "chakra-ui-steps";
import { StepProps } from "chakra-ui-steps/dist/components/Step";
import * as React from "react";

const VerifiedStep = <T, P>({
  isFirstStep = false,
  isLastStep = false,
  ...props
}: {
  isVerified: (input: T) => boolean;
  currentInput: T;
  children: React.ComponentType<P>;
  activeStep: number;
  prevStep: (input: T) => void;
  nextStep: (input: T) => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
} & StepProps) => {
  return (
    <Step {...props}>
      {props.children}
      <Flex width="100%" justify="flex-end">
        <Button
          isDisabled={props.activeStep === 0}
          mr={4}
          onClick={() => props.prevStep(props.currentInput)}
          size="sm"
          variant="ghost"
        >
          Prev
        </Button>
        <Button
          size="sm"
          onClick={() => props.nextStep(props.currentInput)}
          isDisabled={!props.isVerified(props.currentInput)}
        >
          {props.activeStep === 4 ? "Finish" : "Next"}
        </Button>
      </Flex>
    </Step>
  );
};

export default VerifiedStep;
