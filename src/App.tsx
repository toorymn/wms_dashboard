import React from "react";
import Router from "routes/sections";
import "./App.css";
import { ConfigProvider, ThemeConfig } from "antd";
import { ProConfigProvider } from "@ant-design/pro-components";

import mnMn from "antd/locale/mn_MN";

const theme: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: "#3FC5E0",
    fontFamily: "Inter, sans-serif",
    borderRadius: 10,
    colorBgContainer: "white",
    sizeStep: 4,
    sizeUnit: 4,
    colorSuccess: "#22C55E",
  },
  components: {
    Input: {
      lineWidth: 0.7,
      colorBorder: "rgb(33, 43, 54)",
      borderRadius: 6,
      controlHeight: 40,
      padding: 1,
    },
    InputNumber: {
      lineWidth: 0.7,
      colorBorder: "rgb(33, 43, 54)",
      borderRadius: 6,
      controlHeight: 40,
      padding: 1,
    },
    Select: {
      lineWidth: 0.7,
      colorBorder: "rgb(33, 43, 54)",
      borderRadius: 6,
      controlHeight: 40,
    },
    Button: {
      contentFontSize: 16,
      controlHeight: 34,
    },
    Form: {
      labelColor: "#281E1E",
    },
    Table: {
      rowHoverBg: "#E5EAF7",
    },
  },
};

const App: React.FC = () => {
  return (
    <ConfigProvider theme={theme} locale={mnMn}>
      <ProConfigProvider hashed={false} dark={false}>
        <Router />
      </ProConfigProvider>
    </ConfigProvider>
  );
};

export default App;
