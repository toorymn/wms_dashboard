import { PageContainer, ProDescriptions } from "@ant-design/pro-components";
import CountInternalJournalTab from "./InternalJournal";
import { ExclamationCircleOutlined, SendOutlined } from "@ant-design/icons";
import { FC, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import WareHouseJournalTab from "./WarehouseJournal";
import WareHouseZoneAssignmentTab from "./ZoneAssigment";
import ZoneOverViewTab from "./ZoneOverview";
import { Button, Card, Flex, message, Modal, Progress, Tag } from "antd";
import { useRequest } from "ahooks";
import { CountService } from "@/services";
import { COUNT_STATUS, COUNT_STATUS_LABEL } from "@/utils/const";

type TabKey = "internal" | "warehouse" | "zone-assignment" | "zone-overview";
const CountDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get tab from URL query parameter, default to "internal"
  const getTabFromUrl = useCallback((): TabKey => {
    const tabParam = searchParams.get("tab") as TabKey;
    const validTabs: TabKey[] = [
      "internal",
      "warehouse",
      "zone-assignment",
      "zone-overview",
    ];
    return validTabs.includes(tabParam) ? tabParam : "internal";
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

  const [modal, contextHolder] = Modal.useModal();

  const countId = parseInt(id!);

  const internalCounter = useRequest(CountService.getInternalCounter, {
    defaultParams: [Number(id)],
    onError: (err) => message.error(err.message),
  });

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
      if (resp.errors && resp.errors.length > 0) {
        message.error(resp.errors.map((e) => e.message).join(", "));
        return;
      }
      internalCounter.refresh();
      message.success("Амжилттай");
    },
    manual: true,
    onError: (err) => {
      message.error(err.message);
    },
  });

  return (
    <PageContainer
      title="Тооллого дэлгэрэнгүй"
      tabActiveKey={tab}
      extra={[]}
      content={
        <Card style={{ marginBottom: 24 }}>
          <ProDescriptions
            size="small"
            loading={internalCounter.loading}
            column={1}
            dataSource={internalCounter.data}
            bordered
            columns={[
              {
                title: "Тооллого нэр",
                dataIndex: "batchName",
              },
              {
                title: "Агуулах",
                dataIndex: "warehouseCode",
              },

              {
                title: "Төлөв ",
                dataIndex: "status",
                render: (_, record) => (
                  <Tag
                    color={
                      record.status == COUNT_STATUS.STARTED
                        ? "blue"
                        : record.status == COUNT_STATUS.CANCELLED
                        ? "default"
                        : "success"
                    }
                    className="m-0"
                  >
                    {COUNT_STATUS_LABEL[record.status]}
                  </Tag>
                ),
              },
            ]}
          />
        </Card>
      }
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
      onTabChange={(newTab) => {
        handleTabChange(newTab as TabKey);
      }}
      footer={[
        tab == "warehouse" &&
          internalCounter.data?.status == COUNT_STATUS.STARTED && (
            <>
              <Button
                key="cancel"
                onClick={() => {
                  modal.confirm({
                    title: "Confirm",
                    icon: <ExclamationCircleOutlined />,
                    content: <Flex>Тооллогыг цуцлах гэж байна</Flex>,
                    okText: "Итгэлтэй байна",
                    onOk: async () => {
                      await cancelCount.runAsync(countId);
                    },
                    cancelText: "Буцах",
                  });
                }}
              >
                Цуцлах
              </Button>
              ,
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
                    content: (
                      <Flex dir="column">
                        Тооллогыг илгээх гэж байна итгэлтэй байна
                        <CounterSubmitProgress id={countId} />
                      </Flex>
                    ),
                    okText: "Итгэлтэй байна",
                    cancelText: "Буцах",
                  });
                }}
              >
                Тооллого илгээх
              </Button>
            </>
          ),
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

const CounterSubmitProgress: FC<{
  id: number;
}> = ({ id }) => {
  const internalCounter = useRequest(CountService.getInternalCounter, {
    defaultParams: [Number(id)],
    pollingInterval: 1000,
    onError: (err) => message.error(err.message),
  });

  const progress = internalCounter.data
    ? (internalCounter.data.sentItemJournalsQuantity /
        internalCounter.data.totalItemJournalsQuantity) *
      100
    : 0;
  return (
    <Progress
      type="circle"
      percent={progress}
      format={(percent) => `${percent?.toFixed(2)}%`}
    />
  );
};
