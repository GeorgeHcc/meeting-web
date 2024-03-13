import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Tooltip, Avatar, theme, GlobalToken, Empty } from "antd";
import { VideoCameraAddOutlined, UserAddOutlined } from "@ant-design/icons";
import { IconButton } from "@/components/icons/iconButton";
import george from "@/assets/georgeh.jpg";
import ChatRecord from "./ChatRecord";
import ChatFooter from "./ChatFooter";
import { ChatListItemData } from "../LeftContainer/Chat_List";
const { useToken } = theme;

type MsgType = {
  isMe: boolean;
  data: string;
};

const chat = [
  { isMe: true, data: `\n \n 11111111111111` },
  { isMe: true, data: "sjdashddwkwlqa" },
  { isMe: false, data: "sjdashda" },
  { isMe: true, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  {
    isMe: false,
    data: "sjdashddkalllllllllllllllllllllllllllllllllllllllllldjkjfhjhjhjjhjhjh  da",
  },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashdapO😂" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
];
type RightContainerProps = {
  data?: ChatListItemData | null;
};
const RightContainer: React.FC<RightContainerProps> = (props) => {
  const { token } = useToken();

  const [chatMessages, setChatMessages] = useState<MsgType[]>(chat);

  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 9999;
  }, [props.data?.userId]);

  function pushMsg(msg: MsgType) {
    setChatMessages([...chatMessages, msg]);
  }
  return (
    <>
      <Container token={token}>
        {!props.data ? (
          <div style={{ height: "100%", width: "100%", display: "flex" }}>
            <Empty
              description={false}
              imageStyle={{ height: 160 }}
              style={{ margin: "auto " }}
            ></Empty>
          </div>
        ) : (
          <div className="container-wrap">
            <div className="header">
              <div className="header-left h-item">
                <div className="header-userinfo">
                  <span className="user-avatar">
                    <Avatar src={props.data.userAvatar} size={40} />
                  </span>
                  <span className="user-info">
                    <div className="title">{props.data.title}</div>
                    <div className="status">{props.data.userStatus}</div>
                  </span>
                </div>
              </div>
              <div className="header-right h-item">
                <Tooltip title={<span style={{ fontSize: 12 }}>视频通话</span>}>
                  <IconButton icon={<VideoCameraAddOutlined />} />
                </Tooltip>

                <Tooltip title={<span style={{ fontSize: 12 }}>创建群组</span>}>
                  <IconButton icon={<UserAddOutlined />} />
                </Tooltip>
              </div>
            </div>

            <div className="content" ref={contentRef}>
              <div>
                {chatMessages.map((item, index) => {
                  return (
                    <ChatRecord
                      key={`${index}`}
                      isMe={item.isMe}
                      imgUrl={george}
                      data={item.data}
                    ></ChatRecord>
                  );
                })}
              </div>
            </div>

            <div className="footer">
              <ChatFooter {...{ contentRef, pushMsg }} />
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

const Container = styled.div<{ token: GlobalToken }>`
  width: 100%;
  height: 100%;
  display: inline-block;
  color: ${(t) => t.token.colorTextHeading};
  background-color: ${(t) => t.token.colorBgContainer};
  & .container-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    /* position: relative; */

    & .header {
      padding: 20px;
      /* position: absolute; */
      /* padding: 15px; */
      top: 0;
      width: 100%;
      z-index: 99;
      opacity: 1;
      height: 60px;
      /* border-bottom: ${(t) => `1px solid ${t.token.colorBorder}`}; */
      background-color: inherit;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-left {
        & .header-userinfo {
          display: flex;

          & .user-avatar {
            /* height: 100%; */
          }
          & .user-info {
            margin: 0 10px;
            & .title {
              color: inherit;
            }
            & .status {
              color: inherit;
            }
          }
        }
      }
      &-right {
      }
    }
    & .content {
      /* flex-shrink: 0; */
      min-width: 500px;
      z-index: 10;
      overflow-y: scroll;
      background-color: ${(t) => t.token.colorBgLayout};
    }
    & .footer {
      display: flex;
      align-items: center;
      z-index: 99;
    }
  }
`;

export default RightContainer;