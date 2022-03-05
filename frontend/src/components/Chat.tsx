import React, { useEffect, useState } from "react";
import { Box, Container, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getUser,
  useGroupChat,
  User,
  Message,
  useRideChat,
  makeEmptyGroupChat,
  makeEmptyRideChat,
  addChatToGroupChat,
  addChatToRideChat,
} from "../firebase/database";
import { auth } from "../firebase/firebase";

export const GroupChat = ({ groupId }: { groupId: string }) => (
  <Chat dbLocation={{ chatType: "group", id: groupId }} />
);

export const RideChat = ({ rideId }: { rideId: string }) => (
  <Chat dbLocation={{ chatType: "ride", id: rideId }} />
);

function ChatTextBox({
  addChat,
}: {
  addChat: (message: string) => Promise<void>;
}) {
  return (
    <>
      <Input
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            addChat(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </>
  );
}

const ChatContents = (props: { contents: Message[] }) => {
  return (
    <VStack>
      {props.contents.map((m, i) => (
        <MessageComponent key={i} message={m} />
      ))}
    </VStack>
  );
};

const Chat = ({
  dbLocation,
}: {
  dbLocation: { chatType: "ride" | "group"; id: string };
}) => {
  const [chat, messagesLoading, messagesError] =
    dbLocation.chatType === "group"
      ? useGroupChat(dbLocation.id)
      : useRideChat(dbLocation.id);

  const [user, userLoading, userError] = useAuthState(auth);

  if (messagesLoading || userLoading) {
    return <Spinner />;
  } else if (messagesError || userError) {
    console.log(messagesError);
    return <h1>{JSON.stringify(messagesError)}</h1>;
  } else if (chat && user) {
    return (
      <Container p={4}>
        {chat.length === 0 ? (
          <Text>Nothing seems to be here, Say something!</Text>
        ) : (
          <ChatContents
            contents={[...Array.from(new Set(chat))].sort(
              (fst, snd) => fst.timestamp - snd.timestamp
            )}
          />
        )}
        <ChatTextBox
          addChat={(contents) => {
            const message = {
              contents,
              sender_id: user?.uid,
            };
            return dbLocation.chatType === "group"
              ? addChatToGroupChat(dbLocation.id, message)
              : addChatToRideChat(dbLocation.id, message);
          }}
        />
      </Container>
    );
  } else if (!chat) {
    if (dbLocation.chatType === "group") {
      makeEmptyGroupChat(dbLocation.id);
    } else if (dbLocation.chatType === "ride") {
      makeEmptyRideChat(dbLocation.id);
    }
    return <Spinner />;
  } else {
    console.log("Error: NO USER");
    return <h1>Error: NO USER</h1>;
  }
};

const MessageComponent = ({
  message: { contents, sender_id },
}: {
  message: Message;
}) => {
  const [user, setUser] = useState<"loading" | User>("loading");

  useEffect(() => {
    getUser(sender_id).then(setUser);
  }, []);

  return (
    <Box>
      {user === "loading" ? null : (
        <Text>
          {user?.name ?? sender_id}: {contents}
        </Text>
      )}
    </Box>
  );
};
