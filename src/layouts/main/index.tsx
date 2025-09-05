import { useAuthContext } from "@/context/auth";
import {
  CodeSandboxOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  PrinterOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { ProLayout, type ProSettings } from "@ant-design/pro-components";
import { Dropdown } from "antd";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const MainLayout: React.FC<{ children?: React.ReactNode }> = (props) => {
  const [settings] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: "mix",
  });

  const { user, logOut } = useAuthContext();

  const location = useLocation();
  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh",
      }}
    >
      <ProLayout
        logo="./logo.png"
        title={""}
        route={{
          path: "/",
          routes: [
            {
              path: "/",
              name: "Тооллого",
              icon: <OrderedListOutlined />,
            },
            {
              path: "/account",
              name: "Хэрэглэгч",
              icon: <UserSwitchOutlined />,
            },
            {
              path: "/shipment",
              name: "CBM shipment",
              icon: <CodeSandboxOutlined />,
            },
            {
              path: "/tables",
              name: "Хэвлэл",
              icon: <PrinterOutlined />,
            },
          ],
        }}
        location={{
          pathname: location.pathname,
        }}
        siderMenuType="group"
        menu={{
          collapsedShowGroupTitle: true,
        }}
        avatarProps={{
          src: "https://avatar.iran.liara.run/public/30",
          size: "large",
          title: user?.firstName,
          render: (__, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "Гарах",
                      onClick: () => {
                        logOut();
                      },
                    },
                  ],
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
        headerTitleRender={(logo, title, _) => {
          const defaultDom = (
            <a>
              {logo}
              {title}
            </a>
          );
          if (document.body.clientWidth < 1400) {
            return defaultDom;
          }
          if (_.isMobile) return defaultDom;
          return <>{defaultDom}</>;
        }}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <div
              style={{
                textAlign: "center",
                paddingBlockStart: 12,
              }}
            >
              <div>© by Boost LLC</div>
            </div>
          );
        }}
        menuItemRender={(item, dom) => <Link to={item.path || "/"}>{dom}</Link>}
        {...settings}
      >
        {props.children}
      </ProLayout>
    </div>
  );
};

export default MainLayout;
