import { User, Chat } from "../constants";

export interface ChatContextObj {
  user: User;
  setUser?: React.Dispatch<React.SetStateAction<User>>;
  selectedChat: Chat;
  setSelectedChat?: React.Dispatch<React.SetStateAction<Chat>>;
  chats: Chat[];
  setChats?: React.Dispatch<React.SetStateAction<Chat[]>>;
}
