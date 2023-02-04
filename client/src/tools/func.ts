import { User } from "../types";

export const getLocalStorageUserInfo = () => {
  const userInfoStr = localStorage.getItem("userInfo");
  return userInfoStr ? JSON.parse(userInfoStr) : null;
};

export const getSender = (loggedUser: User, users: User[]) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const debounce = <T extends Function>(func: T, delay = 300) => {
  let timer: number = 0;
  return function (...args: any) {
    console.log(timer, "timer");
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => func(...args), delay);
  };
};
