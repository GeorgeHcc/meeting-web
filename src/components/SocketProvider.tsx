import React, { useEffect, ReactNode } from "react";
import { io } from "socket.io-client";
import getUserInfo from "@/utils/getUserInfo";
import SocketContext from "@/context/socketContext";
import useMessageStore from "@/store/modules/messageStore";
import { getCurrentChatData } from "@/utils/getCurrentChatData";
import { useLocation } from "react-router-dom";

const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const socket = io(import.meta.env.VITE_SOCKET_URL);
  const location = useLocation();
  const cacheMessage = useMessageStore((state) => state.cacheMessage);
  const setCurrentChatingMsg = useMessageStore((state) => state.setCurrentChatingMsg);
  useEffect(() => {
    if (location.pathname !== "login" && location.pathname !== "register") {
      socket.emit("online", getUserInfo(["id"]));
      socket.on("receive-msg", (msgs) => {
        if (getCurrentChatData()!._id !== msgs.from) {
          cacheMessage(msgs); //缓存到消息桶
        } else {
          setCurrentChatingMsg(msgs); //推送
        }
      });
    }
  }, []);
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
