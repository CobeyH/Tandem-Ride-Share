import { Button, Flex } from "@chakra-ui/react";
import { Step } from "chakra-ui-steps";
import { StepProps } from "chakra-ui-steps/dist/components/Step";
import * as React from "react";
import { useMemo } from "react";

const VerifiedStep = <T,>({
  isVerified = () => true,
  currentInput,
  children,
  prevStep,
  nextStep,
  isFirstStep = false,
  isLastStep = false,
  ...props
}: {
  isVerified?: (input: T) => boolean;
  currentInput: T;
  children: (JSX.Element | null)[] | (JSX.Element | null);
  prevStep: (input: T) => void;
  nextStep: (input: T) => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
} & StepProps) => {
  const verified = useMemo(
    () => isVerified(currentInput),
    [isVerified, currentInput]
  );

  return (
    <Step
      {...props}
      onKeyDown={(ev) => {
        if (ev.key == "Enter" && verified) {
          nextStep(currentInput);
        }
      }}
    >
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
          isDisabled={!verified}
        >
          {isLastStep ? "Submit" : "Next"}
        </Button>
      </Flex>
    </Step>
  );
};

export default VerifiedStep;
