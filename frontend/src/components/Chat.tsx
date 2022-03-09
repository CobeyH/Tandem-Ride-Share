import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Flex,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
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
import { lightTheme } from "../theme/colours";

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
      <Box p="2">
        <Input
          style={{ position: "absolute", right: 0, left: 0, bottom: 60 }}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              addChat(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
      </Box>
    </>
  );
}

const ChatContents = (props: { contents: Message[]; userId: string }) => {
  let prevSender = "";
  return (
    <VStack spacing={2}>
      <Flex width="100%" flexDir="column">
        {props.contents.map((m, i) => {
          const component = (
            <MessageComponent
              userId={props.userId}
              key={i}
              message={m}
              prevSender={prevSender}
            />
          );
          prevSender = m.sender_id;
          return component;
        })}
      </Flex>
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
      <Container p={3}>
        {chat.length === 0 ? (
          <Text>Nothing seems to be here, Say something!</Text>
        ) : (
          <ChatContents
            contents={[...Array.from(new Set(chat))].sort(
              (fst, snd) => fst.timestamp - snd.timestamp
            )}
            userId={user?.uid}
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
  userId,
  prevSender,
}: {
  message: Message;
  userId: string;
  prevSender: string;
}) => {
  const [sender, setSender] = useState<"loading" | User>("loading");

  useEffect(() => {
    getUser(sender_id).then(setSender);
  }, []);

  const amSender = sender_id === userId;
  return sender === "loading" ? null : (
    <Box pt={1}>
      {sender_id !== prevSender ? (
        <Text pt={3} textAlign={amSender ? "right" : "left"}>
          {sender?.name ?? sender_id}
        </Text>
      ) : null}
      <Text
        p={2}
        borderRadius={7}
        align={amSender ? "right" : "left"}
        background={amSender ? lightTheme.lightButton : lightTheme.darkButton}
      >
        {contents}
      </Text>
    </Box>
  );
};
