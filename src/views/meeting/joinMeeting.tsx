import React, { useEffect, useRef, useState } from "react";
import { Input, Modal, theme, Avatar, Button, Flex, Dropdown, ConfigProvider, message } from "antd";
import type { GlobalToken, ModalProps, MenuProps } from "antd";
import type { ItemType } from "antd/es/menu/hooks/useItems";
import { createFromIconfontCN, UpOutlined } from "@ant-design/icons";

import styled from "styled-components";
import getUserInfo from "@/utils/getUserInfo";
const audioInputGroup = {
  key: "1",
  type: "group",
  label: <span style={{ fontSize: "12px", userSelect: "none" }}>选择麦克风</span>,
  children: [] as ItemType[],
};
const audioOutputGroup = {
  key: "2",
  type: "group",
  label: <span style={{ fontSize: "12px", userSelect: "none" }}>选择扬声器</span>,
  children: [] as ItemType[],
};
const videoInputGroup = {
  key: "1",
  type: "group",
  label: <span style={{ fontSize: "12px" }}>选择摄像头</span>,
  children: [] as ItemType[],
};
const { useToken } = theme;
const IconFont = createFromIconfontCN({
  scriptUrl: ["//at.alicdn.com/t/c/font_4432684_dk043ihaok7.js"],
  extraCommonProps: {
    style: {
      fontSize: "20px",
    },
  },
});

enum Icon {
  AudioOff = "icon-audio-off-light",
  AudioOn = "icon-audio-fill-light",
  VideoOff = "icon-icon-video-off-light",
  VideoOn = "icon-video-light",
}
type JoinMeetingProps = Pick<ModalProps, "open" | "title"> & {
  close: () => void;
};

const JoinMeeting: React.FC<JoinMeetingProps> = (props) => {
  const { token } = useToken();
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);
  const [audioDevice, setAudioDevice] = useState<MenuProps["items"]>([]);
  const [videoDevice, setVideoDevice] = useState<MenuProps["items"]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  useEffect(() => {
    console.log("Mount");
    //获取媒体设备
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices.forEach((device: MediaDeviceInfo) => {
        const item = { key: device.deviceId, label: device.label };
        device.kind === "audioinput"
          ? audioInputGroup.children.push({ ...item, key: `1-${device.deviceId}` })
          : device.kind === "audiooutput"
          ? audioOutputGroup.children.push({ ...item, key: `2-${device.deviceId}` })
          : videoInputGroup.children.push(item);
      });

      setAudioDevice([audioInputGroup, audioOutputGroup]);
      setVideoDevice([videoInputGroup]);
    });
    return () => {
      console.log("unMount");
    };
  }, []);

  useEffect(() => {
    if (props.open) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: { width: 470, height: 250 } })
        .then((stream) => {
          console.log("stream:", stream);
          mediaStreamRef.current = stream;
        })
        .catch((e) => message.error(`${e}`));
    } else {
      //关闭弹窗销毁媒体流
      mediaStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
      setVideo(false);
    }
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current!.getTracks().forEach((track) => {
          track.stop();
        });
      }
      console.log("unMount2");
    };
  }, [props.open]);

  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current!.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
      mediaStreamRef.current!.getVideoTracks().forEach((track) => {
        track.enabled = video;
      });
      if (video && videoRef.current) {
        videoRef.current!.srcObject = mediaStreamRef.current;
        videoRef.current!.onloadedmetadata = () => {
          videoRef.current!.play();
        };
      }
    }
  }, [video]);

  return (
    <>
      <Modal
        // width="auto"
        closable={true}
        open={props.open}
        title={props.title}
        onCancel={props.close}
        footer={[
          <Flex justify="space-between">
            <div>
              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      paddingInlineSM: 3,
                    },
                  },
                }}
              >
                <Flex gap={5}>
                  <Dropdown.Button
                    placement="top"
                    arrow={{ pointAtCenter: true }}
                    menu={{ items: audioDevice, selectable: true }}
                    type="text"
                    style={{
                      backgroundColor: token.colorBgTextHover,
                      borderRadius: 4,
                      paddingInline: 0,
                    }}
                    size="small"
                    trigger={["click"]}
                    icon={<UpOutlined style={{ fontSize: 12 }} />}
                  >
                    <IconFont
                      type={audio ? Icon.AudioOn : Icon.AudioOff}
                      onClick={() => setAudio(!audio)}
                    />
                  </Dropdown.Button>
                  <Dropdown.Button
                    placement="top"
                    arrow={{ pointAtCenter: true }}
                    menu={{ items: videoDevice, selectable: true }}
                    type="text"
                    size="small"
                    trigger={["click"]}
                    icon={<UpOutlined style={{ fontSize: 12 }} />}
                    style={{
                      backgroundColor: token.colorBgTextHover,
                      borderRadius: 4,
                    }}
                  >
                    <IconFont
                      type={video ? Icon.VideoOn : Icon.VideoOff}
                      onClick={() => setVideo(!video)}
                    />
                  </Dropdown.Button>
                </Flex>
              </ConfigProvider>
            </div>
            <div>
              <Button>取消</Button> <Button type="primary">进入会议</Button>
            </div>
          </Flex>,
        ]}
      >
      
          <Input placeholder="输入会议号" style={{marginTop:20}}/>
          <VideoContainer width={470} height={250} token={token}>
            <video ref={videoRef}></video>
            <div className="user-avatar">
              <Avatar
                size={70}
                src={getUserInfo(["avatarImage"])}
                style={{ opacity: video ? 0 : 1 }}
              >
                {getUserInfo(["nick_name"])}
              </Avatar>
            </div>
          </VideoContainer>
       
      </Modal>
    </>
  );
};

type VideoProps = {
  width: number;
  height: number;
  token: GlobalToken;
};
const VideoContainer = styled.div<VideoProps>`
  position: relative;
  margin-top: 10px;
  & > video {
    width: ${(props) => props.width + "px"};
    height: ${(props) => props.height + "px"};
    transform: rotateY(180deg);
    background-color: ${(props) => props.token.colorBgLayout};
  }
  & > .user-avatar {
    position: absolute;
    top: calc(50% - 35px);
    left: calc(50% - 35px);
  }
`;
export default JoinMeeting;
