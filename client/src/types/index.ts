export interface User {
  _id: string;
  name: string;
  pic: string;
  email: string;
  token: string;
}

export interface Message {
  sender: User;
  content: string;
}

export interface Chat {
  isGroupChat: boolean;
  users: User[];
  _id: string;
  chatName: string;
  groupAdmin?: User;
  latestMessage?: Message;
}
