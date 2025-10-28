import { PageLoading } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import {
  Card,
  Collapse,
  CollapseProps,
  Flex,
  Result,
  Statistic,
  Table,
  Typography,
  message,
} from "antd";
import { FC } from "react";
import dayjs from "dayjs";
import ShipmentService, {
  LocationReportGate,
  ShipmentOrder,
} from "@/services/shipment";
import { cubageConverter } from "@/utils/const";

const machine1 = 8; //8m3/
const machine2 = 16; //16m3

const _getColor = (percentage: number) => {
  if (percentage < 50) return "#3f8600";
  if (percentage < 80) return "#FADB14";
  return "#cf1322";
};

const ShipmentReportPage: FC<{
  date: dayjs.Dayjs;
}> = ({ date }) => {
  const fetch = useRequest(
    () => ShipmentService.shipmentReport(date.toDate()),
    {
      refreshDeps: [date],
      onError: (err) => message.error(err.message),
    }
  );

  if (fetch.loading) {
    return <PageLoading />;
  }

  if (fetch.data?.records.length === 0) {
    return <Result status="info" title="No data" />;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {fetch.data?.records.map((warehouse) => (
        <Card
          key={warehouse.locationCode}
          title={warehouse.locationCode}
          style={{ width: "100%", maxWidth: "100%" }}
        >
          <ShipmentReportLocation warehouse={warehouse} />
        </Card>
      ))}
    </div>
  );
};

const ShipmentReportLocation: FC<{ warehouse: LocationReportGate }> = ({
  warehouse,
}) => {
  const items: CollapseProps["items"] = warehouse.gates.map((report) => ({
    key: report.gate,
    label: (
      <Flex dir={"column"} gap={"small"} style={{ width: "100%" }}>
        <Typography.Title level={5}>{report.gate}</Typography.Title>
        <Flex dir={"column"} gap={"small"} style={{ width: "100%" }}>
          <Card size="small" style={{ width: "100%" }}>
            <Statistic
              title="Total"
              value={cubageConverter(report.cbm)}
              precision={2}
              suffix="m³"
            />
          </Card>
          <Card size="small" style={{ width: "100%" }}>
            <Statistic
              title="Машин 1"
              value={(cubageConverter(report.cbm) / machine1) * 100}
              precision={2}
              valueStyle={{
                color: _getColor(
                  (cubageConverter(report.cbm) / machine1) * 100
                ),
              }}
              suffix="%"
            />
          </Card>

          <Card size="small" style={{ width: "100%" }}>
            <Statistic
              title="Машин 2"
              value={(cubageConverter(report.cbm) / machine2) * 100}
              precision={2}
              valueStyle={{
                color: _getColor(
                  (cubageConverter(report.cbm) / machine2) * 100
                ),
              }}
              suffix="%"
            />
          </Card>
        </Flex>
      </Flex>
    ),
    children: (
      <Table<ShipmentOrder>
        columns={[
          {
            title: "Date",
            dataIndex: "postedDate",
            key: "postedDate",
            render: (date) => dayjs(date).format("YYYY-MM-DD"),
          },
          {
            title: "destinationNo",
            dataIndex: "destinationNo",
            key: "destinationNo",
          },
          {
            title: "CBM",
            dataIndex: "cbm",
            key: "cbm",
            render: (cbm) => `${cubageConverter(cbm)} m³`,
          },
        ]}
        dataSource={report.orders}
      />
    ),
  }));

  if (items?.length == 0) return null;
  return <Collapse items={items} />;
};

export default ShipmentReportPage;
