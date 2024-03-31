import { IUserInfo } from "@/views/messages/types";

export const getCurrentChatData = () => {
  const sessionChatData: IUserInfo | null = sessionStorage.getItem("current-chat-data")
    ? JSON.parse(sessionStorage.getItem("current-chat-data")!)
    : null;
  return sessionChatData;
};
