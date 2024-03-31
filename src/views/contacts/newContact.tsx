import React, { useEffect, useState } from "react";
import { Avatar, List, Button, message, Input, Modal, Form } from "antd";
import axios from "axios";
import { IUserInfo } from "../messages/LeftContainer";
import getUserInfo from "@/utils/getUserInfo";
import styled from "styled-components";
import { on } from "events";
export type ApplyMsg = {
  user: IUserInfo;
  applyMsg: string;
  status: boolean;
};
function NewContact() {
  const [userApplyList, setUserApplyList] = useState<ApplyMsg[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<ApplyMsg | null>();
  const [form] = Form.useForm();

  const fetchData = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/user/getApplyMsg/${getUserInfo(["id"])}`)
      .then((res: any) => {
        setUserApplyList(res.data.applyList);
        console.log("res.data.applyList:", res.data.applyList);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const agreeApply = (item: ApplyMsg) => {
    setSelected(item);
    setIsModalOpen(true);
  };
  const onFinish = (value: any) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/user/applyFriends`, {
        userId: getUserInfo(["id"]),
        friendId: selected!.user._id,
        status: true,
        remark: value.remark,
      })
      .then((res) => {
        if (res.data.status) {
          setIsModalOpen(false);
          form.resetFields();
          fetchData();
          message.success(`${res.data.msg}`);
        }
      })
      .catch((e) => {
        message.error(`${e}`);
      });
  };

  return (
    <Container>
      {userApplyList ? (
        <List
          bordered
          itemLayout="horizontal"
          dataSource={userApplyList!}
          renderItem={(item) => (
            <List.Item
              actions={
                item.status
                  ? [<span>已添加</span>]
                  : [
                      <Button type="primary" onClick={() => agreeApply(item)}>
                        接受
                      </Button>,
                    ]
              }
            >
              <List.Item.Meta
                avatar={<Avatar size={50} src={item.user.avatarImage}></Avatar>}
                title={<a>{item.user.nick_name}</a>}
                description={item.applyMsg}
              />
            </List.Item>
          )}
        />
      ) : (
        ""
      )}

      <Modal
        open={isModalOpen}
        title="通过朋友验证"
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
      >
        <Form
          key={2}
          layout="vertical"
          labelCol={{ span: 4 }}
          form={form}
          onFinish={onFinish}
          style={{ marginTop: 20 }}
        >
          <Form.Item name="remark" label="备注">
            <Input allowClear value={selected?.user.nick_name} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              发送
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px 10px;
  width: 100%;
`;
export default NewContact;
