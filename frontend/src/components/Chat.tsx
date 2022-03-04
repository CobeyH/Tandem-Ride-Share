import React from "react";
import { ref, set } from "firebase/database";
import {
  auth,
  db,
  DB_GROUP_CHAT_COLLECT,
  DB_RIDE_CHAT_COLLECT,
  DB_USER_COLLECT,
  User,
} from "../firebase";
import { Box, Container, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import { useList, useObjectVal } from "react-firebase-hooks/database";
import slugify from "slugify";
import { useAuthState } from "react-firebase-hooks/auth";

type MessageTimestamp = number;

type Message = {
  sender_id: string;
  contents: string;
  timestamp: MessageTimestamp;
};

const makeMessage = ({
  sender_id,
  contents,
}: Omit<Message, "timestamp">): Message => ({
  sender_id,
  contents,
  timestamp: Date.now(),
});

export const GroupChat = ({ groupId }: { groupId: string }) => (
  <Chat dbLocation={`${DB_GROUP_CHAT_COLLECT}/${groupId}`} />
);

export const RideChat = ({ rideId }: { rideId: string }) => (
  <Chat dbLocation={`${DB_RIDE_CHAT_COLLECT}/${rideId}`} />
);

function ChatTextBox({
  dbLocation,
  userId,
}: {
  dbLocation: string;
  userId: string;
}) {
  return (
    <>
      <Input
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            set(
              ref(
                db,
                `${dbLocation}/${slugify(e.currentTarget.value + Date.now())}`
              ),
              makeMessage({
                sender_id: userId,
                contents: e.currentTarget.value,
              })
            );
          }
        }}
      />
    </>
  );
}

const Chat = (props: { dbLocation: string }) => {
  const [chat, messagesLoading, messagesError] = useList(
    ref(db, props.dbLocation)
  );
  console.log({ chat });

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
            contents={[
              ...Array.from(
                new Set(chat.map((value) => value.val() as Message))
              ),
            ].sort(({ timestamp: fst }, { timestamp: snd }) => fst - snd)}
          />
        )}
        <ChatTextBox dbLocation={props.dbLocation} userId={user.uid} />
      </Container>
    );
  } else if (!chat) {
    set(ref(db, props.dbLocation), []).then(() => {
      console.log(`Created an empty chat at ${props.dbLocation}`);
    });
    return <Spinner />;
  } else {
    console.log("Error: NO USER");
    return <h1>Error: NO USER</h1>;
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
}) => {
  const [user, userLoading, userError] = useObjectVal<User>(
    ref(db, `${DB_USER_COLLECT}/${sender_id}`)
  );

  return (
    <Box>
      {userLoading || userError ? null : (
        <Text>
          {user?.name ?? sender_id}: {contents}
        </Text>
      )}
    </Box>
  );
};
