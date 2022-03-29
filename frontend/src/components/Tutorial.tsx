import { Button, IconButton, theme } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import Joyride, { Props } from "react-joyride";

interface TutorialProps extends Props {
  buttonText?: string;
}

const Tutorial = (props: TutorialProps) => {
  const [started, setStarted] = useState<boolean>(false);
  return (
    <>
      {props.buttonText ? (
        <Button
          variant={"ghost"}
          aria-label="Tutorial-Trigger"
          id="tutorial"
          rightIcon={<FaQuestionCircle />}
          onClick={() => setStarted(true)}
          mr={3}
        >
          {props.buttonText}
        </Button>
      ) : (
        <IconButton
          variant={"ghost"}
          aria-label="Tutorial-Trigger"
          id="tutorial"
          icon={<FaQuestionCircle />}
          onClick={() => setStarted(true)}
          mr={3}
        />
      )}
      <Joyride
        steps={props.steps}
        continuous
        showSkipButton
        run={started}
        showProgress
        styles={{ options: { zIndex: theme.zIndices.modal + 1 } }}
      />
    </>
  );
};

export default Tutorial;