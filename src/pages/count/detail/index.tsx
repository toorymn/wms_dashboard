import { PageContainer } from "@ant-design/pro-components";
import CountInternalJournalTab from "./InternalJournal";
import { ExclamationCircleOutlined, SendOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WareHouseJournalTab from "./WarehouseJournal";
import WareHouseZoneAssignmentTab from "./ZoneAssigment";
import ZoneOverViewTab from "./ZoneOverview";
import { Button, message, Modal } from "antd";
import { useRequest } from "ahooks";
import { CountService } from "@/services";

type TabKey = "internal" | "warehouse" | "zone-assignment" | "zone-overview";
const CountDetailPage = () => {
  const { id } = useParams();
  const [tab, setTab] = useState<TabKey>("internal");
  const navigate = useNavigate();

  const [modal, contextHolder] = Modal.useModal();

  const countId = parseInt(id!);

  const cancelCount = useRequest(CountService.cancelCount, {
    onSuccess: () => {
      message.success("Амжилттай");
      navigate("/");
    },
    manual: true,
    onError: (err) => {
      message.error(err.message);
    },
  });

  const submitCount = useRequest(CountService.submitCount, {
    onSuccess: (resp) => {
      console.log(resp);
      if (resp.errors && resp.errors.length > 0) {
        message.error(resp.errors.map((e) => e.message).join(", "));
        return;
      }
      message.success("Амжилттай");
    },
    manual: true,
    onError: (err) => {
      message.error(err.message);
    },
  });

  return (
    <PageContainer
      title="Тооллого дэлгэрэнгүй(W-002323)"
      tabActiveKey={tab}
      extra={[]}
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
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            modal.confirm({
              title: "Confirm",
              icon: <ExclamationCircleOutlined />,
              content: "Тооллогыг цуцлах гэж байна ",
              okText: "Итгэлтэй байна",
              onOk: async () => {
                await cancelCount.runAsync(countId);
              },
              cancelText: "Буцах",
            });
          }}
        >
          Цуцлах
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            modal.confirm({
              title: "Confirm",
              icon: <SendOutlined />,
              onOk: async () => {
                await submitCount.runAsync(countId);
              },
              content: "Тооллогыг илгээх гэж байна итгэлтэй байна уу ",
              okText: "Итгэлтэй байна",
              cancelText: "Буцах",
            });
          }}
        >
          Тооллого илгээх
        </Button>,
      ]}
    >
      {tab == "internal" && <CountInternalJournalTab countId={countId} />}
      {tab == "warehouse" && <WareHouseJournalTab countId={countId} />}
      {tab == "zone-assignment" && (
        <WareHouseZoneAssignmentTab countId={countId} />
      )}
      {tab == "zone-overview" && <ZoneOverViewTab countId={countId} />}
      {contextHolder}
    </PageContainer>
  );
};

export default CountDetailPage;
