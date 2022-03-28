import { IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import Joyride, { Props } from "react-joyride";

const Tutorial = (props: Props) => {
  const [started, setStarted] = useState<boolean>(false);
  return (
    <>
      <IconButton
        aria-label="Tutorial-Trigger"
        icon={<FaQuestionCircle />}
        onClick={() => setStarted(true)}
      />
      <Joyride
        steps={props.steps}
        continuous
        showSkipButton
        run={started}
        showProgress
      />
    </>
  );
};

export default Tutorial;
