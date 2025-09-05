import { PageContainer } from "@ant-design/pro-components";
import { useState } from "react";
import ShipmentHistoryPage from "./history";
import ShipmentReportPage from "./report";
import dayjs from "dayjs";
import { DatePicker } from "antd";

type TabKey = "history" | "report";

const ShipmentPage = () => {
  const [tab, setTab] = useState<TabKey>("report");

  const [reportDate, setReportDate] = useState(dayjs());

  return (
    <PageContainer
      title="CBM shipment"
      tabActiveKey={tab}
      extra={
        <DatePicker
          value={reportDate}
          onChange={(date) => setReportDate(date)}
        />
      }
      tabList={[
        {
          tab: "Тайлан",
          key: "report",
        },
        {
          tab: "Түүх",
          key: "history",
        },
      ]}
      onTabChange={(tab) => {
        setTab(tab as TabKey);
      }}
    >
      {tab == "history" && <ShipmentHistoryPage date={reportDate} />}
      {tab == "report" && <ShipmentReportPage date={reportDate} />}
    </PageContainer>
  );
};

export default ShipmentPage;
