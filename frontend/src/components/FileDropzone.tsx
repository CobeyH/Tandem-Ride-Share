import { Flex, Text, useToast } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { styleColors } from "../theme/colours";

const FileDropzone = (props: {
  parentCallback: (banner: Blob | MediaSource) => void;
}) => {
  const [fileAccepted, setFileAccepted] = useState<boolean>(false);
  const toast = useToast();

  // Only runs when a file is successfully selected.
  const onDropAccepted = useCallback((acceptedFiles) => {
    const file = acceptedFiles?.[0];
    if (!file) {
      return;
    }
    setFileAccepted(true);
    toast({
      title: `File Selection Successful`,
      status: "success",
      description:
        "Your file has been selected and will be uploaded when you confirm group creation.",
    });
    props.parentCallback(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
  });
  return (
    <Flex
      justify="center"
      align="center"
      textAlign="center"
      m={2}
      p={5}
      borderColor={fileAccepted ? styleColors.green : "black"}
      borderWidth={2}
      borderRadius={5}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {fileAccepted ? (
        <Text>File Selected</Text>
      ) : isDragActive ? (
        <Text>Drop the files here...</Text>
      ) : (
        <Text>Drag files here, or click to select files</Text>
      )}
    </Flex>
  );
};

export default FileDropzone;
