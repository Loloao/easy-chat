import React, { useEffect, useState } from "react";
import axios from "axios";

import { Chat } from "./type";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);

  const fetchChats = async () => {
    const { data } = await axios.get<Chat[]>("/api/chats");

    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((v) => (
        <div key={v._id}>{v.chatName}</div>
      ))}
    </div>
  );
}
