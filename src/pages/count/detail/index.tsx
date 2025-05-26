import { PageContainer } from "@ant-design/pro-components";
import CountInternalJournalTab from "./InternalJournal";
import { useState } from "react";
import { useParams } from "react-router-dom";
import WareHouseJournalTab from "./WarehouseJournal";

type TabKey = "internal" | "warehouse";
const CountDetailPage = () => {
  const { id } = useParams();
  const [tab, setTab] = useState<TabKey>("internal");

  const countId = parseInt(id!);

  return (
    <PageContainer
      title="Тооллого дэлгэрэнгүй(W-002323)"
      tabActiveKey={tab}
      tabList={[
        {
          tab: "Нэгтгэл",
          key: "warehouse",
        },
        {
          tab: "Дотоод тоолллого",
          key: "internal",
        },
      ]}
      onTabChange={(tab) => {
        setTab(tab as TabKey);
      }}
      extra={[]}
    >
      {tab == "internal" && <CountInternalJournalTab countId={countId} />}
      {tab == "warehouse" && <WareHouseJournalTab countId={countId} />}
    </PageContainer>
  );
};

export default CountDetailPage;
