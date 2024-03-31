import React, { useState, useRef, RefObject } from "react";
import styled from "styled-components";
import { purple } from "@ant-design/colors";
import { Button, GlobalToken, Input, Popover, theme } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { IconButton } from "@/components/icons/iconButton";
import { EmojiOutlined } from "@/components/icons/iconFont";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import useSocket from "@/hooks/useSocket";
import getUserInfo from "@/utils/getUserInfo";
import { MsgType } from ".";
const { useToken } = theme;

const { TextArea } = Input;

export type ChatFooterProps = {
  contentRef: RefObject<HTMLDivElement>;
  targetUserId: string | number;
  pushMsg: (msg: MsgType) => void;
};
const ChatFooter: React.FC<ChatFooterProps> = (props) => {
  //   const [chatMessages, setChatMessages] = useState<ChatMsgType[]>(chat);
  const [inputingData, setInputingData] = useState<string>("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const io = useSocket();
  const { token } = useToken();
  function sendMessage(msg: string) {
    if (msg.trim().length > 0) {
      props.pushMsg({ msg: inputingData!, isMe: true });
      setOpenEmoji(false); //关闭Emoji弹框
      setInputingData("");
      io.emit("send-msg", { senderId: getUserInfo(["id"]), targetUserId: props.targetUserId, msg });
      queueMicrotask(() => {
        props.contentRef.current!.scrollTop = 9999; //滚动到底部
      });
    } else {
      setOpenPopover(true);
      setTimeout(() => {
        setOpenPopover(false);
      }, 1000);
      setInputingData("");
    }
  }
  return (
    <Container token={token}>
      <Popover title="不能发送空的消息哦😘" open={openPopover}>
        <TextArea
          ref={textAreaRef}
          allowClear
          placeholder="发送给George"
          value={inputingData}
          autoSize={{ minRows: 1, maxRows: 6 }}
          onChange={(e) => {
            setInputingData(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.shiftKey && e.key === "Enter") {
              setInputingData(inputingData + "\n");
            }
            if (e.key === "Enter") {
              e.preventDefault();
              return e.shiftKey || sendMessage(inputingData!);
            }
          }}
        />
      </Popover>

      <EmojiWrap>
        <EmojiPicker isOpen={openEmoji}>
          <Picker
            data={data}
            onEmojiSelect={(emo: { native: string }) => {
              textAreaRef.current!.focus();
              setInputingData(inputingData + emo.native);
            }}
            skinTonePosition="search"
            // theme="dark"
            // onClickOutside={() => setOpenEmoji(false)}
          />
        </EmojiPicker>
        <IconButton
          icon={<EmojiOutlined />}
          onClick={() => {
            textAreaRef.current!.focus();
            setOpenEmoji(!openEmoji);
          }}
        />
      </EmojiWrap>

      {/* <SendOutlined twoToneColor={purple[5]} /> */}
      <Button
        type="primary"
        icon={<SendOutlined />}
        disabled={inputingData.length === 0}
        onClick={() => sendMessage(inputingData!)}
      >
        发送
      </Button>
    </Container>
  );
};

const Container = styled.div<{ token: GlobalToken }>`
  width: 100%;
  background-color: ${(t) => t.token.colorBgContainer};
  min-height: 72px;
  max-height: 182px;
  display: flex;
  gap: 25px;
  align-items: center;
  padding: 20px 10px;
  & > span.anticon:first-child {
    cursor: pointer;
    color: ${purple[5]} !important;
    font-size: 25px !important;
    transition: all 0.5s ease;
    &:hover {
      transform: rotate(180deg);
    }
  }
`;

const EmojiWrap = styled.div`
  position: relative;
`;

// type EmojiPickerProps = { isOpen: boolean };
const EmojiPicker = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 40px;
  right: -75px;
  z-index: 9999;
  border-radius: 1px solid red;
  padding: 10px;
  ${(props) => (props.isOpen ? "display:block;" : "display: none;")}
`;
export default ChatFooter;
