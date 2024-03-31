import React, { useEffect, useState } from "react";
import { Avatar, Dropdown, theme, Badge } from "antd";
import type { MenuProps } from "antd";
import useMessageStore from "@/store/modules/messageStore";
import { IGroup } from "../types";
import formatTime from "@/utils/format";
// const { useToken } = theme;

export type ChatListItemData = {
  friendID: string;
  userStatus?: string;
  avatarImage?: string;
  remark?: string;
  nick_name?: string;
  title?: string;
  lastMsg?: string;
  lastTime: string;
  lastChatRecords?: [];
} & IGroup & { type?: "friend" | "group" };
export interface ChatListProps {
  data: ChatListItemData;
  onSelected: (selectedVal: ChatListItemData) => void;
  currentSelect: string | null;
}

const items: MenuProps["items"] = [
  {
    label: "置顶",
    key: "1",
  },
  {
    label: "消息免打扰",
    key: "2",
  },
  {
    label: "标记为未读",
    key: "3",
  },
  {
    label: "删除消息",
    key: "4",
  },
];

const ChatListItem: React.FC<ChatListProps> = ({ data, onSelected, currentSelect }) => {
  const [unRead, setUnRead] = useState(0);
  const messageBucket = useMessageStore((state) => state.messages);
  const incrementMsgCnt=useMessageStore(state=>state.increment)
  const consumeMessage = useMessageStore((state) => state.consumeMessage);
  const decrementMsgCnt = useMessageStore((state) => state.decrement);

  useEffect(() => {
    if (messageBucket.has(data.friendID)) {
      setUnRead(messageBucket.get(data.friendID)!.length);
    }
   
  }, [messageBucket, data.friendID]);

  //右键菜单选中事件
  const handleDropDownClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "1":
        break;
      case "2":
        break;
      case "3":
        incrementMsgCnt()
        setUnRead(1);
        break;
      case "4":
        break;
    }
  };

  return (
    <Dropdown
      menu={{ items, onClick: handleDropDownClick }}
      trigger={["contextMenu"]}
      key={data.friendID}
    >
      <li
        className={`list-item ${data.friendID === currentSelect && "selected"}`}
        key={data.friendID}
        onClick={() => {
          consumeMessage(data.friendID);
          decrementMsgCnt(1)
          // setSelectedItem(data.friendID);
          onSelected(data);
          setUnRead(0);
        }}
      >
        <div className="left">
          <Badge count={unRead} size="small">
            {data.avatarImage ? (
              <Avatar size={40} shape="square" src={data.avatarImage} />
            ) : (
              <Avatar size={40} shape="square">
                {data.nick_name}
              </Avatar>
            )}
          </Badge>

          <span className="chat-info">
            <p className="chat-title">{data.remark || data.nick_name}</p>
            <p className="chat-last-msg">{data.lastMsg}</p>
          </span>
        </div>
        <div className="right">
          <div className="chat-last-time">{formatTime(data.lastTime)}</div>
          <div className="other"></div>
        </div>
      </li>
    </Dropdown>

    // </ChatListItemContainer>
  );
};

export default React.memo(ChatListItem);
