import React, { startTransition, useEffect, useState } from "react";
import { ConfigProvider, Menu, Badge } from "antd";
import type { MenuProps } from "antd";
import { purple } from "@ant-design/colors";
import { VideoCameraFilled, MessageFilled, SettingFilled } from "@ant-design/icons";
import { ContactListFilled } from "@/components/icons/iconFont";
import { useNavigate, useLocation } from "react-router-dom";
import useMessageStore from "@/store/modules/messageStore";
type MenuItem = Required<MenuProps>["items"][number];

function genItem(title: React.ReactNode, key: React.Key, icon?: React.ReactNode): MenuItem {
  return { key, icon, title } as MenuItem;
}

const V_Menu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unReadNum, setUnReadNum] = useState(0);
  const totalMessage = useMessageStore((state) => state.totalMessage);
  const [selectedKey, setSelectedKey] = useState(location.pathname);
  useEffect(() => {
    setSelectedKey(location.pathname); // 当 URL 变化时更新选中键
  }, [location]);
  
  useEffect(() => {
    setUnReadNum(totalMessage);
  }, [totalMessage]);

  const items: MenuItem[] = [
    genItem(
      "消息",
      "/messages",
      <Badge size="small" count={unReadNum}>
        <MessageFilled />
      </Badge>
    ),
    genItem("视频会议", "/meeting", <VideoCameraFilled />),
    genItem("通讯录", "/contacts", <ContactListFilled />),
    genItem("设置", "/setting", <SettingFilled />),
  ];

  const handleSelect = ({ key }: { key: string }) => {
    startTransition(() => {
      navigate(key);
    });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBorderRadius: 0,
            iconSize: 20,
            itemHeight: 50,
            itemMarginInline: 0,
            itemMarginBlock: 0,
            itemPaddingInline: "",
            itemSelectedBg: purple[5], //菜单项选中态背景色
            itemHoverBg: "rgba(0, 0, 0, 0.06)", //菜单项悬浮态背景色
            itemSelectedColor: "#fff", //菜单项文字选中颜色
            itemHoverColor: purple[2], //"#fff", //菜单项文字悬浮颜色
            itemActiveBg: "",
            itemColor: "#fff", //"#c5c5c5",
          },
        },
      }}
    >
      <Menu
        items={items}
        mode="inline"
        defaultSelectedKeys={["/messages"]}
        selectedKeys={[selectedKey]}
        // inlineCollapsed={true}
        style={{ height: "100%", backgroundColor: `${purple[6]}` }}
        onSelect={handleSelect}
      >
      </Menu>
    </ConfigProvider>
  );
};

export default V_Menu;
