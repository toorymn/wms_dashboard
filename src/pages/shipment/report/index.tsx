import { PageLoading } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import {
  Card,
  Collapse,
  CollapseProps,
  Flex,
  Result,
  Row,
  Statistic,
  Table,
  Typography,
  message,
} from "antd";
import { FC } from "react";
import dayjs from "dayjs";
import ShipmentService, { ShipmentOrder } from "@/services/shipment";

const machine1 = 8; //8m3/
const machine2 = 16; //16m3

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

  const _getColor = (percentage: number) => {
    if (percentage < 50) return "#3f8600";
    if (percentage < 80) return "#FADB14";
    return "#cf1322";
  };

  const items: CollapseProps["items"] = fetch.data?.records.map((report) => ({
    key: report.gate,
    label: (
      <Row justify={"space-between"}>
        <Typography.Title level={5}>{report.gate}</Typography.Title>
        <Flex align={"middle"} gap={"small"}>
          <Card size="small">
            <Statistic
              title="Total"
              value={report.cbm}
              precision={2}
              suffix="m³"
            />
          </Card>
          <Card size="small">
            <Statistic
              title="Машин 1"
              value={(report.cbm / machine1) * 100}
              precision={2}
              valueStyle={{ color: _getColor((report.cbm / machine1) * 100) }}
              suffix="%"
            />
          </Card>

          <Card size="small">
            <Statistic
              title="Машин 2"
              value={(report.cbm / machine2) * 100}
              precision={2}
              valueStyle={{ color: _getColor((report.cbm / machine2) * 100) }}
              suffix="%"
            />
          </Card>
        </Flex>
      </Row>
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
          },
        ]}
        dataSource={report.orders}
      />
    ),
  }));

  if (items?.length == 0)
    return <Result status="warning" title="There is not data for this date" />;
  return <Collapse items={items} />;
};

export default ShipmentReportPage;
