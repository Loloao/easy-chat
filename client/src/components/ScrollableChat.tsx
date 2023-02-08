import React from "react";
import { Message } from "../constants";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../tools";
import { ChatState } from "../context/chatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { m } from "framer-motion";

interface Props {
  messages: Message[];
}

const ScrollableChat = ({ messages }: Props) => {
  const { user } = ChatState();
  console.log(messages, "messages");

  return (
    <ScrollableFeed>
      {messages.length
        ? messages.map((v, i) => (
            <div style={{ display: "flex" }} key={v._id}>
              {(isSameSender(messages, v, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip label={v.sender.name} placement="bottom" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={v.sender.name}
                    src={v.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    v.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(messages, v, i, user._id),
                  marginTop: isSameUser(messages, v, i) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {v.content}
              </span>
            </div>
          ))
        : null}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
