import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useColorModeValue,
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
} from "../../firebase/database";
import { auth } from "../../firebase/firebase";
import { lightTheme, styleColors } from "../../theme/colours";
import { IoMdSend } from "react-icons/io";

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
}) => {
  const [message, setMessage] = useState("");
  return (
    <Box w="95%">
      <InputGroup>
        <Input
          onKeyDown={(e) => {
            if (e.key == "Enter" && message !== "") {
              addChat(message);
              setMessage("");
            }
          }}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message"
          value={message}
        />
        <InputRightElement>
          <IconButton
            aria-label="send-message"
            icon={<IoMdSend />}
            variant="ghost"
            onClick={() => {
              addChat(message);
              setMessage("");
            }}
            isDisabled={message.length <= 0}
            color={useColorModeValue(styleColors.medBlue, styleColors.mainBlue)}
          />
        </InputRightElement>
      </InputGroup>
    </Box>
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

  const ref = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (ref?.current) ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  });

  let prevSender = "";
  if (messagesLoading || userLoading) {
    return <Spinner />;
  } else if (messagesError || userError) {
    console.log(messagesError);
    return <h1>{JSON.stringify(messagesError)}</h1>;
  } else if (chat && user) {
    return (
      <VStack height="100%">
        <Flex
          flexDir="column"
          width="100%"
          height="100%"
          px={3}
          overflowY="scroll"
        >
          {chat.length === 0 ? (
            <Text>Nothing seems to be here, Say something!</Text>
          ) : (
            chat.map((m, i) => {
              const component = (
                <MessageComponent
                  userId={user.uid}
                  key={i}
                  message={m}
                  prevSender={prevSender}
                />
              );
              prevSender = m.sender_id;
              return component;
            })
          )}
          <div ref={ref} />
        </Flex>
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
    <>
      <Box pt={1} alignSelf={amSender ? "flex-end" : "flex-start"}>
        {sender_id !== prevSender ? (
          <Text pt={3} textAlign={amSender ? "right" : "left"}>
            {sender?.name ?? sender_id}
          </Text>
        ) : null}
      </Box>
      <Box pt={1} alignSelf={amSender ? "flex-end" : "flex-start"}>
        <Text
          p={2}
          borderRadius={7}
          align={amSender ? "right" : "left"}
          color={"black"}
          background={amSender ? lightTheme.lightButton : lightTheme.main}
        >
          {contents}
        </Text>
      </Box>
    </>
  );
};
