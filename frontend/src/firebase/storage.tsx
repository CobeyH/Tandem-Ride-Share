import {
  connectStorageEmulator,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { app } from "./firebase";

export const storage = getStorage(app);

export enum PhotoType {
  banners = "banners",
  profilePics = "profilePics",
}

if (location.hostname === "localhost") {
  connectStorageEmulator(storage, "localhost", 9199);
}

export const uploadBanner = async (
  groupId: string,
  photoType: PhotoType,
  banner: Blob | MediaSource
) => {
  if (!banner) {
    return;
  }
  const blobUrl = URL.createObjectURL(banner);
  const blob = await fetch(blobUrl).then((r) => r.blob());
  const imageRef = ref(storage, `${photoType}/${groupId}`);
  await uploadBytes(imageRef, blob);
  return imageRef;
};
