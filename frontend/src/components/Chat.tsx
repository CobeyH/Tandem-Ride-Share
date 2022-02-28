import React from "react";
import { DatabaseReference, ref, set } from "firebase/database";
import { db, DB_GROUP_CHAT_COLLECT, DB_RIDE_CHAT_COLLECT } from "../firebase";
import { Spinner, VStack, Text, Heading, Box } from "@chakra-ui/react";
import { useListVals } from "react-firebase-hooks/database/dist/database/useList";

type MessageTimestamp = number; // (new Date()).getTime()

type Message = {
  sender_id: string;
  contents: string;
  timestamp: MessageTimestamp;
};

export const GroupChat = (groupId: string) => (
  <Chat dbLocation={ref(db, `${DB_GROUP_CHAT_COLLECT}/${groupId}`)} />
);

export const RideChat = (rideId: string) => (
  <Chat dbLocation={ref(db, `${DB_RIDE_CHAT_COLLECT}/${rideId}`)} />
);

const Chat = (props: { dbLocation: DatabaseReference }) => {
  const [chat, loading, error] = useListVals<Message>(props.dbLocation, {});

  if (loading) {
    return <Spinner />;
  } else if (error) {
    console.log(error);
    return <h1>{JSON.stringify(error)}</h1>;
  } else if (chat) {
    return (
      <ChatContents
        contents={chat.sort(
          ({ timestamp: fst }, { timestamp: snd }) => fst - snd
        )}
      />
    );
  } else {
    // the docs say this will have an effect immediately, and we don't need to guard against calling it twice. :/
    set(props.dbLocation, []).then(() =>
      console.log(`Created an empty chat at ${props.dbLocation.key}`)
    );
    return <Spinner />;
  }
};

const ChatContents = (props: { contents: Message[] }) => {
  return (
    <VStack>
      {props.contents.map((m, i) => (
        <Message key={i} message={m} />
      ))}
    </VStack>
  );
};

const Message = ({
  message: { contents, sender_id },
}: {
  message: Message;
}) => (
  <Box>
    <Heading>{sender_id}</Heading>
    <Text>{contents}</Text>
  </Box>
);
