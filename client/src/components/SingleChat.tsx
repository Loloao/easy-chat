import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  Toast,
} from "@chakra-ui/react";
import React, {
  ChangeEvent,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import { ChatState } from "../context/chatProvider";
import ProfileModal from "./Miscellaneous/ProfileModal";
import { defaultChat } from "../context/chatProvider";
import { getSender, getSenderFull, setTokenFetch } from "../tools";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import { Message, SERVER_ADDRESS } from "../constants";
import io from "socket.io-client";
import axios from "axios";

interface Props {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }: Props) => {
  const [message, setMessage] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const { user, selectedChat, setSelectedChat } = ChatState();

  const sendMessage: KeyboardEventHandler<HTMLDivElement> = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        setMessage([...message, data]);
      } catch (error) {
        Toast({
          title: "发送聊天信息失败!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    socket = io(SERVER_ADDRESS);
  }, []);
  return (
    <>
      {selectedChat._id ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              aria-label=""
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat!(defaultChat)}
            />
            {
              // messages &&
              !selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    // fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )
            }
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                {/* <ScrollableChat messages={messages} /> */}
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {/* {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )} */}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            点击用户进行聊天
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
