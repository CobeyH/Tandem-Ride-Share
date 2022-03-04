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
        placeholder={"send a message . . ."}
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
            e.currentTarget.value = "";
          }
        }}
      />
    </>
  );
}

const Chat = ({ dbLocation }: { dbLocation: string }) => {
  const [chat, messagesLoading, messagesError] = useList(ref(db, dbLocation));

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
              ...Array.from(new Set(chat.map((v) => v.val() as Message))),
            ].sort((fst, snd) => fst.timestamp - snd.timestamp)}
          />
        )}
        <ChatTextBox dbLocation={dbLocation} userId={user.uid} />
      </Container>
    );
  } else if (!chat) {
    set(ref(db, dbLocation), []).then(() => {
      console.log(`Created an empty chat at ${dbLocation}`);
    });
    return <Spinner />;
  } else {
    console.log("Error: NO USER");
    return <h1>Error: NO USER</h1>;
  }
};

const ChatContents = ({ contents }: { contents: Message[] }) => (
  <VStack>
    {contents.map((message, i) => (
      <Message key={i} message={message} />
    ))}
  </VStack>
);

const Message = ({
  message: { contents, sender_id },
}: {
  message: Message;
}) => {
  const [user, userLoading, userError] = useObjectVal<User>(
    ref(db, `${DB_USER_COLLECT}/${sender_id}`) // this seems terribly inefficient, but I don't see a reasonable way around it.
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
