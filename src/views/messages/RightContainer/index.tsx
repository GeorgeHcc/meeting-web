import React, { useState, useRef, useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  Tooltip,
  Avatar,
  theme,
  GlobalToken,
  Empty,
  ConfigProvider,
  Popconfirm,
  message,
  Drawer,
  Divider,
  Button,
  Card,
  Flex,
  Switch,
  Space,
} from "antd";
// import { createStyles, useTheme } from "antd-style";
import type { DrawerStyles } from "antd/es/drawer/DrawerPanel";
import {
  VideoCameraAddOutlined,
  UserAddOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { IconButton } from "@/components/icons/iconButton";
import ChatRecord from "./ChatRecord";
import ChatFooter from "./ChatFooter";
import { ChatListItemData } from "../LeftContainer/ChatListItem";
import useSocket from "@/hooks/useSocket";
import { getMsgListByUser } from "@/service/api";
import axios from "axios";
import getUserInfo from "@/utils/getUserInfo";
import { produce } from "immer";
import { getCurrentChatData } from "@/utils/getCurrentChatData";
import { IMessage, IUserInfo } from "../types";
import useMessageStore from "@/store/modules/messageStore";
const { useToken } = theme;

export type MsgType = Partial<IUserInfo> & Partial<IMessage> & { isMe: boolean };

export type ReceivedMsg = MsgType & { from: string; to?: string; msg?: string };

type RightContainerProps = {
  data?: ChatListItemData | null;
};

const RightContainer: React.FC<RightContainerProps> = (props) => {
  const { token } = useToken();
  const drawerStyles: DrawerStyles = {
    mask: {
      backdropFilter: "blur(10px)",
    },
    content: {
      boxShadow: "-10px 0 10px #666",
    },
    header: {},
    body: {
      backgroundColor: token.colorBgLayout,
      padding: 10,
    },
    footer: {
      backgroundColor: token.colorBgLayout,
    },
  };

  const [chatMessages, setChatMessages] = useState<MsgType[]>(() => [{ msg: "", isMe: false }]);
  const contentRef = useRef<HTMLDivElement | null>(null);

  //获取当前好友列表选中的好友消息记录
  useEffect(() => {
    const fetchData = async () => {
      const userId = getUserInfo(["id"]);
      try {
        const res = await axios.post(getMsgListByUser, { from: userId, to: props.data!.friendID });
        const list = res.data.msgList.map((item: any) => {
          const msg = { msg: item.msg, time: item.time };
          return item.from === userId ? { ...msg, isMe: true } : { ...msg, isMe: false };
        });
        setChatMessages([...list]);
      } catch (error) {
        console.log("Error fetching chat messages:", error);
      }
    };
    // 如果props.data有效，则执行数据请求
    if (props.data) {
      fetchData();
    }
  }, [props.data]);

  //自动滚动到消息底部（最新消息）
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 9999;
  }, [props.data?.friendID, chatMessages]);

  const currentChatingMsg = useMessageStore((state) => state.currentChatingMsg);
  const setCurrentChatingMsg = useMessageStore((state) => state.setCurrentChatingMsg);
  useEffect(() => {
    // console.log("currentChatingMsg:", currentChatingMsg);
    const newMsg = produce(chatMessages, (draft) => {
      draft.push({ ...currentChatingMsg, isMe: false });
    });
    setChatMessages(newMsg);
    () => {
      setCurrentChatingMsg({});
    };
  }, [currentChatingMsg]);

  function pushMsg(msg: MsgType) {
    setChatMessages([...chatMessages, msg]);
  }

  //------------------------Drawer设置-----------------------------------
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onDrawerClose = () => {
    setDrawerOpen(false);
  };

  //------------------------PopConfirm-----------------------------------
  const confirm = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.success("Click on Yes");
  };

  const cancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.error("Click on No");
  };

  //===============================render=========================================
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
                    {props.data.avatarImage ? (
                      <Avatar size={40} src={props.data.avatarImage} />
                    ) : (
                      <Avatar size={40}>{props.data.nick_name}</Avatar>
                    )}
                  </span>
                  <span className="user-info">
                    <div className="title">{props.data.remark}</div>
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
                <Divider type="vertical" />
                <IconButton icon={<UnorderedListOutlined />} onClick={() => setDrawerOpen(true)} />
              </div>
            </div>

            <div className="content" ref={contentRef}>
              <div>
                {chatMessages.map((item, index) => {
                  return (
                    <ChatRecord
                      key={`${index}`}
                      isMe={item.isMe}
                      avatarImage={
                        item.isMe ? getUserInfo(["avatarImage"]) : props.data?.avatarImage
                      }
                      nick_name={item.isMe ? getUserInfo(["nick_name"]) : props.data?.nick_name}
                      msg={item.msg}
                    ></ChatRecord>
                  );
                })}
              </div>
            </div>

            <div className="footer">
              <ChatFooter {...{ contentRef, pushMsg }} targetUserId={props.data.friendID} />
            </div>
          </div>
        )}
        <ConfigProvider
          drawer={{
            styles: drawerStyles,
          }}
        >
          <Drawer
            title="聊天设置"
            open={drawerOpen}
            onClose={onDrawerClose}
            footer={
              <Button type="text" danger block>
                删除好友
              </Button>
            }
          >
            <Flex vertical gap={10}>
              <Card size="small" style={{ cursor: "pointer" }}>
                {/* <Flex align="center"> */}
                <Space>
                  <PlusCircleFilled style={{ fontSize: 25, color: "#bcbcbc" }} />
                  发起群聊
                </Space>
                {/* </Flex> */}
              </Card>
              <Card size="small">
                <Flex justify="space-between">
                  设为顶置 <Switch></Switch>
                </Flex>
                <Divider style={{ margin: 10 }} />
                <Flex justify="space-between">
                  隐藏会话 <Switch></Switch>
                </Flex>
                <Divider style={{ margin: 10 }} />
                <Flex justify="space-between">
                  消息免打扰 <Switch></Switch>
                </Flex>
              </Card>

              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Card size="small" style={{ cursor: "pointer" }}>
                  <span>删除聊天记录</span>
                </Card>
              </Popconfirm>
            </Flex>
          </Drawer>
        </ConfigProvider>
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
      flex: 1;
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

export default React.memo(RightContainer);
