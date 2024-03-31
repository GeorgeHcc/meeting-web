import React, { startTransition, useCallback, useEffect, useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  GithubFilled,
  WechatFilled,
  TikTokOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input, theme, Avatar, Card, ConfigProvider, message } from "antd";
import styled from "styled-components";
import { IconButton } from "@/components/icons/iconButton";
import { loginApi } from "@/service/api";
import { NavLink, useNavigate } from "react-router-dom";
import userStore from "@/store/modules/userStore";
import axios from "axios";
// import service from "@/service/server";
import { useService } from "@/context/serviceContext";

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const setUserId = userStore((state) => state.setUserId);
  const navigate = useNavigate();
  const service = useService();
  // useEffect(() => {
  //   const account = localStorage.getItem("account-info")
  //     ? JSON.parse(localStorage.getItem("account-info")!)
  //     : null;
  //   if (account) {
  //     setUserId(account.id);
  //     navigate("/");
  //   }
  // });

  const onFinish = (values: unknown) => {
    console.log(values);
    try {
      setLoading(true);
      service
        .post("/login", values)
        .then((res) => {
          if (res.data.status) {
            message.success(`${res.data.msg} Hi,${res.data.user.nick_name}!`);
            localStorage.setItem("account-info", JSON.stringify(res.data.user));
            localStorage.setItem("refresh-token", JSON.stringify(res.data.refreshToken));

            setUserId(res.data.user.id);
            navigate("/");
          } else {
            message.error(res.data.msg);
          }
        })
        .catch((e) => {
          console.log(e.message);
          message.error(e.message);
        })
        .finally(() => {
          setLoading(false);
        });
      //@ts-ignore
    } catch (e: any) {
      message.error(e);
    }
  };
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Form: { verticalLabelPadding: 6 },
        },
      }}
    >
      <Container>
        <Card className="login-panel">
          <div className="logo">
            <Avatar size={64} icon={<UserOutlined />} />
          </div>
          <div className="title">Sign in to Voyage</div>
          <div className="form-container">
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              {/* 用户名 */}
              <Form.Item
                name="account"
                label="Account"
                className="login-form-account"
                rules={[{ required: true, message: "Please input username" }]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Account"
                />
              </Form.Item>
              {/* 密码 */}
              <Form.Item
                name="password"
                label="Password"
                className="login-form-password"
                rules={[{ required: true, message: "Please input your Password!" }]}
                // help={<span style={{fontSize:12}}>至少包含数字、字符</span>}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                  size="large"
                />
              </Form.Item>

              <Form.Item className="login-remember">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>remember me</Checkbox>
                </Form.Item>
                <a className="login-form-forgot" href="">
                  forget password?
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={loading}
                >
                  Sign in
                </Button>
              </Form.Item>

              <div className="login-form-bottom">
                <span>
                  <IconButton icon={<GithubFilled />} />
                  <IconButton icon={<WechatFilled />} />
                  <IconButton icon={<TikTokOutlined />} />
                </span>
                <span className="login-form-rigster">
                  no account?{" "}
                  <a
                    onClick={() => {
                      startTransition(() => {
                        navigate("/register");
                      });
                    }}
                  >
                    sign up
                  </a>
                </span>
              </div>
            </Form>
          </div>
        </Card>
      </Container>
    </ConfigProvider>
  );
};

const Container = styled.body`
  color: black;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  background-color: black;
  & .login-panel {
    height: auto;
    margin-right: 100px;
    & .ant-card-body {
      padding-bottom: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      & .form-container {
        min-width: 320px;
        max-width: 360px;
        & .login-form-account {
          margin-bottom: 16px;
        }
        & .login-form-password {
          margin-bottom: 6px;
        }
        & .login-form-button {
          width: 100%;
        }

        & .login-form-rigster {
          float: right;
        }

        & .login-form-forgot {
          font-size: 12px;
          float: right;
        }
        & .login-form-bottom {
          vertical-align: middle;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
      }
      & .title {
        font-size: 30px;
        margin-bottom: 10px;
      }
    }
  }
`;

export default Login;
