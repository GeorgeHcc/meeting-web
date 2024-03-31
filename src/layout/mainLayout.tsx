import styled from "styled-components";
import { Layout, Avatar } from "antd";
import { purple } from "@ant-design/colors";
import React, { ReactNode } from "react";
import george from "@/assets/georgeh.jpg";

import V_Menu from "@/components/menu";
import getUserInfo from "@/utils/getUserInfo";
const { Sider, Content, Header } = Layout;
type mainLayoutProps = {
  children: ReactNode;
  //   menu?: ReactNode;
  header?: ReactNode;
  mode?: "default" | "empty";
};
export const MainLayout: React.FC<mainLayoutProps> = ({ children, mode = "default", header }) => {
  return mode === "empty" ? (
    <>{children}</>
  ) : (
    <Layout style={{ height: "100%" }}>
      {/* <Header>广告栏 or系统通告占位</Header> */}
      {header ? <Header>{header}</Header> : <></>}
      <Layout style={{ height: "100%" }}>
        {/* 菜单栏 */}
        <OutterSider width={60}>
          <UserAvatar src={getUserInfo(["avatarImage"])} size={45}>
            {getUserInfo(["nick_name"])}
          </UserAvatar>
          <V_Menu />
        </OutterSider>
        <Layout>{children}</Layout>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
const OutterSider = styled(Sider)`
  width: ${(props) => props.width};
  height: 100%;
  background: ${purple[6]} !important;
  text-align: center;

  & li {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 20px 0;
  border: 2px solid white;
  user-select: auto;
  cursor: pointer;
`;
