import { Button, Flex } from "@chakra-ui/react";
import { Step } from "chakra-ui-steps";
import { StepProps } from "chakra-ui-steps/dist/components/Step";
import * as React from "react";

const VerifiedStep = <T,>({
  isVerified = () => true,
  currentInput,
  children,
  activeStep,
  prevStep,
  nextStep,
  isFirstStep = false,
  isLastStep = false,
  ...props
}: {
  isVerified?: (input: T) => boolean;
  currentInput: T;
  children: (JSX.Element | null)[] | (JSX.Element | null);
  activeStep: number;
  prevStep: (input: T) => void;
  nextStep: (input: T) => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
} & StepProps) => {
  return (
    <Step {...props}>
      {children}
      <Flex width="100%" justify="flex-end" pt={2}>
        <Button
          isDisabled={isFirstStep}
          mr={4}
          onClick={() => prevStep(currentInput)}
          size="sm"
          variant="ghost"
        >
          Prev
        </Button>
        <Button
          size="sm"
          onClick={() => nextStep(currentInput)}
          isDisabled={!isVerified(currentInput)}
        >
          {isLastStep ? "Submit" : "Next"}
        </Button>
      </Flex>
    </Step>
  );
};

export default VerifiedStep;
