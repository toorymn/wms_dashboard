import { PageContainer } from "@ant-design/pro-components";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ShipmentHistoryPage from "./history";
import ShipmentReportPage from "./report";
import dayjs from "dayjs";
import { DatePicker, Row } from "antd";

type TabKey = "history" | "report";

const ShipmentPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get tab from URL query parameter, default to "report"
  const getTabFromUrl = useCallback((): TabKey => {
    const tabParam = searchParams.get("tab") as TabKey;
    const validTabs: TabKey[] = ["history", "report"];
    return validTabs.includes(tabParam) ? tabParam : "report";
  }, [searchParams]);

  const [tab, setTab] = useState<TabKey>(getTabFromUrl());

  // Update tab state when URL changes
  useEffect(() => {
    setTab(getTabFromUrl());
  }, [getTabFromUrl]);

  // Function to update tab and URL
  const handleTabChange = (newTab: TabKey) => {
    setTab(newTab);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", newTab);
    setSearchParams(newSearchParams);
  };

  const [reportDate, setReportDate] = useState(dayjs());

  return (
    <PageContainer
      title="CBM shipment"
      tabActiveKey={tab}
      extra={
        <Row>
          <DatePicker
            value={reportDate}
            onChange={(date) => setReportDate(date)}
          />
        </Row>
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
      onTabChange={(newTab) => {
        handleTabChange(newTab as TabKey);
      }}
    >
      {tab == "history" && <ShipmentHistoryPage date={reportDate} />}
      {tab == "report" && <ShipmentReportPage date={reportDate} />}
    </PageContainer>
  );
};

export default ShipmentPage;
