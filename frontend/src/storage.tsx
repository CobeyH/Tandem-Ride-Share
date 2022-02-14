import { getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { app } from "./firebase";

const storage = getStorage(app);

export const DropZone = () => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles?.[0];

    if (!file) {
      return;
    }
    try {
      await upload(URL.createObjectURL(file), `${file.name}_${Date.now()}`);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const upload = async (blobUrl: string, name: string) => {
    alert(name);
    const blob = await fetch(blobUrl).then((r) => r.blob());
    const imageRef = ref(storage, `${name}`);
    uploadBytes(imageRef, blob);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag n drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default DropZone;
