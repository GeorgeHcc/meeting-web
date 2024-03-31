import React from "react";
import styled, { css } from "styled-components";
import { purple } from "@ant-design/colors";
import { Avatar, GlobalToken, theme } from "antd";
const { useToken } = theme;
import { MsgType } from ".";

// function splitStringIntoArray(str: string | null | undefined, chunkSize: number) {
//   const array = [];
//   // const reg = /\\n/g;
//   if (str?.length==0||!str) return [];
//   else {
//     for (let i = 0; i < str.length; i += chunkSize) {
//       // Ensure we don't go beyond the string length
//       const end = Math.min(i + chunkSize, str.length);
//       const chunk = str.substring(i, end);
//       array.push(chunk);
//     }
//     return array;
//   }
// }
export type ChatRecordProps = MsgType;
const ChatRecord: React.FC<ChatRecordProps> = (props) => {
  const { token } = useToken();

  return (
    <RecordItem isme={props.isMe?.toString()} token={token}>
      {/* <ChatUserAvatar src={props.imgUrl} size={40}></ChatUserAvatar> */}
      {props.avatarImage ? (
        <ChatUserAvatar size={40} src={props.avatarImage} />
      ) : (
        <ChatUserAvatar size={40}>{props.nick_name}</ChatUserAvatar>
      )}
      <div className="chat-bubble">
        {/* {splitStringIntoArray(props.data, 60).map((item, key) => (
          <p key={key} className="chat-bubble-content">
            {item}
          </p>
        ))} */}
        {props.msg}
       
      </div>
    </RecordItem>
  );
};

const ChatUserAvatar = styled(Avatar)`
  display: inline-block;
  vertical-align: top;
  margin-top: 10px;
`;

type P = { isme: string; token: GlobalToken };

const RecordItem = styled.div<P>`
  /* width: 100%; */
  background-color: ${(t) => t.token.colorBgLayout};
  color: ${(t) => t.token.colorTextHeading};
  margin: 20px;
  display: flex;
  ${(p) =>
    p.isme === "true"
      ? css`
          flex-direction: row-reverse;
        `
      : ""}

  & .chat-bubble {
    white-space: pre-wrap; //控制显示换行
    display: inline-block;
    max-width: 50%;
    position: relative;
    padding: 10px;
    border-radius: 6px;
    margin: 10px;

    ${(p) =>
      p.isme !== "true"
        ? `background-color:${p.token.colorBgElevated};`
        : css`
            background-color: ${purple[3]};
          `}

    &::before {
      content: "";
      position: absolute;
      left: ${(p) => (p.isme === "true" ? "none;" : "-6px;")};
      right: ${(p) => (p.isme === "true" ? "-6px;" : "none;")};
      top: 10px;
      width: 0;
      height: 0;
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
      border-width: 7px;
      border-left: ${(p) => (p.isme === "true" ? `7px solid ${purple[3]};` : "none;")};
      border-right: ${(p) =>
        p.isme === "true" ? "none;" : `7px solid ${p.token.colorBgElevated};`};
    }
    &-content {
      margin: 0px;
      user-select: text;
      font-size: 16px;
    }
  }
`;

export default ChatRecord;
