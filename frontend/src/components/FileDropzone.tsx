import { Flex, Text } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { lightTheme } from "../theme/colours";

const FileDropzone = (props: {
  parentCallback: (banner: Blob | MediaSource) => void;
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles?.[0];

    if (!file) {
      return;
    }
    props.parentCallback(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Flex
      justify="center"
      align="center"
      textAlign="center"
      m={2}
      p={5}
      borderColor="black"
      borderWidth={1}
      borderRadius={5}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Text>Drop the files here...</Text>
      ) : (
        <Text>Drag files here, or click to select files</Text>
      )}
    </Flex>
  );
};

export default FileDropzone;
