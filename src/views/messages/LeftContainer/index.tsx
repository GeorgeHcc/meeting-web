import React, { useState, useEffect, useCallback, ReactNode, useMemo } from "react";
import {
  Button,
  Input,
  Dropdown,
  theme,
  message,
  Modal,
  Form,
  List,
  Avatar,
  Flex,
  Descriptions,
  Select,
} from "antd";
import type { GlobalToken, MenuProps, SelectProps } from "antd";
import styled from "styled-components";
import ChatListItem from "./ChatListItem";
import type { ChatListItemData } from "./ChatListItem";
import getUserInfo from "@/utils/getUserInfo";
import axios from "axios";
import george from "@/assets/georgeh.jpg";
import { getFriendsList } from "@/service/api";
import {
  SearchOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  VideoCameraAddOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import service from "@/service/server";

const { TextArea } = Input;
const { useToken } = theme;
const items: MenuProps["items"] = [
  { key: "addContacts", label: "添加联系人", icon: <UserAddOutlined /> },
  { key: "createGroup", label: "创建群组", icon: <UsergroupAddOutlined /> },
  { key: "joinMeeting", label: "加入会议", icon: <VideoCameraAddOutlined /> },
];
export interface IUserInfo {
  _id: string;
  nick_name?: string;
  account: string;
  email?: string;
  isAvatarImageSet?: boolean;
  avatarImage?: string;
  birthday?: string;
  phone?: string;
  phone_prefix?: string;
  gender?: string;
}

export type LeftContainerProps = {
  userSelectedChange: (userData: any) => void;
};
const genDescription = (item: IUserInfo | null) => {
  //@ts-ignore
  const m = new Date(item?.birthday).getMonth();
  //@ts-ignore
  const d = new Date(item?.birthday).getDate();
  return {
    title: item?.nick_name,
    items: [
      { key: "1", label: "性别", children: item?.gender },
      { key: "2", label: "生日", children: `${m}月${d}` },
      { key: "3", label: "邮箱", children: item?.email },
    ],
  };
};

const LeftContainer: React.FC<LeftContainerProps> = ({ userSelectedChange }) => {
  const { token } = useToken();
  const [firendsList, setFirendsList] = useState<ChatListItemData[]>([]);

  const [currentSelect, setCurrentSelect] = useState<string | null>("");

  //初始化数据获取
  useEffect(() => {
    const sessionChatData = sessionStorage.getItem("current-chat-data")
      ? JSON.parse(sessionStorage.getItem("current-chat-data")!)
      : null;
    setCurrentSelect(sessionChatData?.friendID);
    const userId = getUserInfo(["id"]);
    //获取好友列表
    axios.get(`${getFriendsList}/${userId}`).then((res) => {
      setFirendsList(res.data.friendList);
    });
    // axios.post(`${import.meta.env.VITE_API_URL}/`);
  }, []);

  //ChatListItem选中的回调
  const handleSelectChange = useCallback(
    (seletedVal: ChatListItemData) => {
      setCurrentSelect(seletedVal.friendID);
      userSelectedChange(seletedVal);
    },
    [userSelectedChange]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState<{ title: string; content?: ReactNode }>({ title: "" });
  type DropdowmKey = "addContacts" | "createGroup" | "joinMeeting" | null;
  const [currentSelectDropdowmItem, setCurrentSelectDropdowmItem] = useState<DropdowmKey>();
  //下拉菜单点击事件处理
  const handleDropDownClick: MenuProps["onClick"] = ({ key }) => {
    setIsModalOpen(true);
    setCurrentSelectDropdowmItem(key);
    switch (key) {
      case "addContacts":
        setModalInfo({ title: "添加联系人" });
        break;

      case "createGroup":
        setModalInfo({ title: "创建群组" });
        break;

      case "joinMeeting":
        break;
    }
  };
  //------------------------------------添加联系人-----------------------------------//

  const [modalForm] = Form.useForm();

  const [searchedUserList, setSearchedUserList] = useState<any[]>([]);
  const closeModal = () => {
    setSearchedUserList([]);
    setIsModalOpen(false);
    modalForm.resetFields();
  };

  const fetchData = (value: any) => {
    console.log("value", value);
    service
      .post('/user/getUser', {
        ...value,
        userId: getUserInfo(["id"]),
      })
      .then((res) => {
        setSearchedUserList(res.data.users);
      });
  };

  // 内嵌模态框
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subModalData, setSubModalData] = useState<{
    row: IUserInfo;
    title: IUserInfo["nick_name"];
    items: any[];
  } | null>();

  const [subModalForm] = Form.useForm();

  const closeSubModal = () => {
    subModalForm.resetFields();
    setIsSubModalOpen(false);
  };
  const openSubModal = (item: IUserInfo) => {
    const data = genDescription(item);
    setSubModalData({ row: item, ...data });
    setIsSubModalOpen(true);
  };

  const addFriendApply = (value: any) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/user/addFriends`, {
        ...value,
        userId: getUserInfo(["id"]),
        friendId: subModalData?.row._id,
      })
      .then((res) => {
        closeSubModal();
        res.data.status ? message.success(`${res.data.msg}`) : message.warning(`${res.data.msg}`);
      })
      .catch((e) => {
        message.error(`${e}`);
      });
  };

  const SubModalContent = (
    <Modal open={isSubModalOpen} footer={null} onCancel={closeSubModal}>
      <Flex vertical gap={20}>
        <div
          style={{
            width: "100%",
            height: 200,
            background: "linear-gradient(to right, #7f7fd5, #86a8e7, #91eae4)",
            position: "relative",
            borderRadius: "5px",
            marginTop: 20,
          }}
        >
          <Avatar
            src={subModalData?.row.avatarImage}
            size={80}
            style={{
              position: "absolute",
              bottom: "-40px",
              zIndex: 1000,
              border: "2px solid #fff",
            }}
          >
            {subModalData?.row.nick_name}
          </Avatar>
        </div>
        <Descriptions
          style={{ marginTop: 40 }}
          title={subModalData?.title}
          column={1}
          items={subModalData?.items}
        ></Descriptions>

        <Form
          key={2}
          layout="vertical"
          labelCol={{ span: 4 }}
          form={subModalForm}
          onFinish={addFriendApply}
          style={{ marginTop: 20 }}
        >
          <Form.Item name="remark" label="备注">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="applyMsg" label="验证消息">
            <TextArea showCount allowClear />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              发送好友申请
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Modal>
  );
  const contactsModalContent = (
    <>
      <Form
        key={1}
        layout="inline"
        form={modalForm}
        style={{ padding: "20px 0" }}
        onFinish={fetchData}
      >
        <Form.Item name="nickName" rules={[{ required: true, message: "无效输入" }]}>
          <Input placeholder="输入用户昵称" style={{ width: 375 }} allowClear />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
      </Form>
      <div className="search-previrw">
        <List
          dataSource={searchedUserList}
          itemLayout="horizontal"
          renderItem={(item: IUserInfo) => (
            <List.Item
              actions={[
                <Button type="text" onClick={() => openSubModal(item)}>
                  查看
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar>{item.nick_name}</Avatar>}
                title={<a onClick={() => openSubModal(item)}>{item.nick_name}</a>}
              />
            </List.Item>
          )}
        />
      </div>
      {SubModalContent}
    </>
  );
  /**---------------------------------------创建群组--------------------------------- */
  const [createGroupFrom] = Form.useForm();

  const options = useMemo(
    () =>
      firendsList.map((item) => ({
        value: item.friendID,
        label: (
          <>
            <Avatar src={item.avatarImage} size={24}>
              {item.nick_name}
            </Avatar>
            <span style={{ marginInline: 10 }}>{item.nick_name}</span>
          </>
        ),
      })),
    [firendsList]
  );
  const createGroupFinish = (value: any) => {
    console.log(value);
    axios
      .post(`${import.meta.env.VITE_API_URL}/group/createGroup`, {
        ...value,
        groupHost: getUserInfo(["id"]),
      })
      .then((res) => {
        if (res.data.status) {
          message.success(`${res.data.msg}`);
        }
      });
  };

  const GroupModalContent = (
    <>
      <Form form={createGroupFrom} layout="horizontal" onFinish={createGroupFinish}>
        <Form.Item
          name="groupName"
          label="群聊名称"
          rules={[{ required: true, message: "无效输入" }]}
        >
          <Input placeholder="群组名称" allowClear />
        </Form.Item>
        <Form.Item name="members" label="邀请成员">
          <Select mode="multiple" options={options} maxTagCount={4}></Select>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" block>
            创建群聊
          </Button>
        </Form.Item>
      </Form>
    </>
  );

  /*=======================================Render=================================*/
  return (
    <Container token={token}>
      <div className="header">
        <Input
          placeholder="搜索"
          maxLength={250}
          minLength={250}
          prefix={<SearchOutlined />}
          suffix={"(ctrl+k)"}
          onChange={(e) => console.log(e.target.value)}
        />
        <Dropdown menu={{ items, onClick: handleDropDownClick }} trigger={["click"]}>
          <Button shape="circle" onClick={() => {}}>
            <PlusOutlined />
          </Button>
        </Dropdown>
      </div>

      <ChatList token={token}>
        {firendsList &&
          firendsList!.map((friendItem) => (
            <ChatListItem
              data={friendItem!}
              onSelected={handleSelectChange}
              currentSelect={currentSelect}
            />
          ))}
      </ChatList>

      <Modal title={modalInfo.title} open={isModalOpen} footer={null} onCancel={closeModal}>
        {currentSelectDropdowmItem === "addContacts" ? (
          contactsModalContent
        ) : currentSelectDropdowmItem === "createGroup" ? (
          GroupModalContent
        ) : (
          <></>
        )}
        {/* {GroupModalContent} */}
      </Modal>
    </Container>
  );
};

/*======================================Style======================================*/
const Container = styled.div<{ token: GlobalToken }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${(t) => t.token.colorText};
  background-color: ${(t) => t.token.colorBgContainer};
  & .header {
    padding: 15px 10px;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > span {
      width: 200px;
    }
    & .ant-input-suffix {
      color: ${(t) => t.token.colorTextDescription};
    }
  }
`;

const ChatList = styled.ul<{ token: GlobalToken }>`
  flex-grow: 1;
  overflow-y: scroll;
  padding: 0 5px;
  margin: 0;
  color: ${(t) => t.token.colorTextHeading};
  background-color: ${(t) => t.token.colorBgContainer};
  & .list-item {
    padding: 0px 10px;
    display: flex;
    align-items: center;
    border-radius: 3px;

    &:hover {
      background-color: ${(t) => t.token.colorBgTextHover};
    }
    &.selected {
      background-color: ${(t) => t.token.colorBgTextActive};
    }
    & .left {
      padding: 10px 0;
      display: flex;
      align-items: center;
      overflow: hidden;
      flex: 1;
      width: 200px;
      & .chat-info {
        width: 160px;
        height: 50px;
        margin-left: 10px;
        padding: 2px 0 2px 0;
        & .chat-title {
          font-weight: 600;
          margin: 0;
          white-space: nowrap;
        }
        & .chat-last-msg {
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 0.75rem;
          margin-bottom: 0;
          margin-top: 5px;
          color: ${(t) => t.token.colorTextDescription};
        }
      }
    }
    & .right {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 50px;
      & .chat-last-time {
        /* font-family: "Microsoft YaHei New", 微软雅黑, "Microsoft Yahei", "Microsoft JhengHei",
          SimSun, "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif; */

        font-size: 0.75rem;
      }
    }
  }
`;

export default LeftContainer;
