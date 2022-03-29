import { Avatar, AvatarProps } from "@chakra-ui/react";
import { ref } from "firebase/storage";
import * as React from "react";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { Group } from "../../firebase/database";
import { storage } from "../../firebase/storage";
import { groupLogos } from "../../theme/colours";
import * as icons from "react-icons/gi";
import { IconType } from "react-icons";

interface Props extends AvatarProps {
  group: Group;
  index: number;
}

const GroupAvatar = (props: Props) => {
  const { index, group, ...avatarProps } = props;
  const photoName = group.profilePic;
  const profileRef =
    photoName && photoName.startsWith("profilePics/")
      ? ref(storage, `${photoName}`)
      : undefined;
  const [profilePic, profilePicLoading] = useDownloadURL(profileRef);

  return profilePicLoading ? null : profilePic ? (
    <Avatar
      bg={groupLogos[index % groupLogos.length]}
      src={profilePic}
      {...avatarProps}
    />
  ) : photoName ? (
    <Avatar
      bg={groupLogos[index % groupLogos.length]}
      as={(icons as { [k: string]: IconType })[photoName]}
      {...avatarProps}
    />
  ) : (
    <Avatar
      bg={groupLogos[index % groupLogos.length]}
      name={photoName ? undefined : group.name}
      {...avatarProps}
    />
  );
};

export default GroupAvatar;
