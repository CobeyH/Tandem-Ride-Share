import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

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
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag and drop a banner image here, or click to select a file</p>
      )}
    </div>
  );
};

export default FileDropzone;