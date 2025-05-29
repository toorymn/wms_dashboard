import { PageContainer } from "@ant-design/pro-components";
import CountInternalJournalTab from "./InternalJournal";
import { useState } from "react";
import { useParams } from "react-router-dom";
import WareHouseJournalTab from "./WarehouseJournal";
import WareHouseZoneAssignmentTab from "./ZoneAssigment";
import ZoneOverViewTab from "./ZoneOverview";

type TabKey = "internal" | "warehouse" | "zone-assignment" | "zone-overview";
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
        {
          tab: "Ажлын жагсаалт",
          key: "zone-assignment",
        },
        {
          tab: "Бүсийн тайлан",
          key: "zone-overview",
        },
      ]}
      onTabChange={(tab) => {
        setTab(tab as TabKey);
      }}
      extra={[]}
    >
      {tab == "internal" && <CountInternalJournalTab countId={countId} />}
      {tab == "warehouse" && <WareHouseJournalTab countId={countId} />}
      {tab == "zone-assignment" && (
        <WareHouseZoneAssignmentTab countId={countId} />
      )}
      {tab == "zone-overview" && <ZoneOverViewTab countId={countId} />}
    </PageContainer>
  );
};

export default CountDetailPage;
