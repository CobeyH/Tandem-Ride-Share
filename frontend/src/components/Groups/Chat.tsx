import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Input, Spinner, Text, VStack } from "@chakra-ui/react";
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
} from "../../firebase/database";
import { auth } from "../../firebase/firebase";
import { lightTheme } from "../../theme/colours";

export const GroupChat = ({ groupId }: { groupId: string }) => (
  <Chat dbLocation={{ chatType: "group", id: groupId }} />
);

export const RideChat = ({ rideId }: { rideId: string }) => (
  <Chat dbLocation={{ chatType: "ride", id: rideId }} />
);

const ChatTextBox = ({
  addChat,
}: {
  addChat: (message: string) => Promise<void>;
}) => (
  <Box w="95%">
    <Input
      onKeyDown={(e) => {
        if (e.key == "Enter" && e.currentTarget.value !== "") {
          addChat(e.currentTarget.value);
          e.currentTarget.value = "";
        }
      }}
    />
  </Box>
);

const ChatContents = (props: { contents: Message[]; userId: string }) => {
  const ref = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    const scrollHeight = ref?.current?.scrollHeight ?? 0;
    console.log(scrollHeight);
    if (ref?.current) {
      ref.current?.scrollTo(0, 100000000);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  let prevSender = "";
  return (
    <Flex
      flexDir="column"
      width="100%"
      height="100%"
      px={3}
      overflowY="scroll"
      ref={ref}
    >
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
      <VStack height="100%">
        {chat.length === 0 ? (
          <Text>Nothing seems to be here, Say something!</Text>
        ) : (
          <ChatContents
            contents={[
              ...Array.from(new Set(chat.map((it) => JSON.stringify(it)))).map(
                // please fix this if you can figure out a better way.
                (it) => JSON.parse(it)
              ),
            ].sort((fst, snd) => fst.timestamp - snd.timestamp)}
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
      </VStack>
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
    <Box pt={1} alignSelf={amSender ? "flex-end" : "flex-start"}>
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
