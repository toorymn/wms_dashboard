import type { ActionType } from "@ant-design/pro-components";
import { EyeOutlined } from "@ant-design/icons";
import { ProCard, ProFormInstance, ProTable } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, Card, Col, Row, Statistic, Tag, Tooltip, message } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import ShipmentService, {
  ShipmentGateReport,
  ShipmentOrder,
} from "@/services/shipment";
import { Link } from "react-router-dom";
import ReferenceService from "@/services/ref";
import { cubageConverter } from "@/utils/const";

const machine1 = 8; //8m3/
const machine2 = 16; //16m3

const ShipmentHistoryPage: FC<{
  date: dayjs.Dayjs;
}> = ({ date }) => {
  const actionRef = useRef<ActionType>();

  const fetch = useRequest(ShipmentService.shipmentOrders, {
    manual: true,
    onError: (err) => message.error(err.message),
  });

  const warehouseFetch = useRequest(ReferenceService.warehouses, {
    // manual: true,
    onError: (err) => message.error(err.message),
  });

  const [reportData, setReportData] = useState<ShipmentGateReport[]>([]);
  const ref = useRef<ProFormInstance>();
  const reload = () => actionRef.current?.reload();

  useEffect(() => {
    reload();
  }, [date]);

  return (
    <>
      <ProCard
        title="CBM shipment Report"
        headerBordered
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16}>
          {reportData.map((item) => (
            <Col span={8} key={item.gate}>
              <Card title={item.gate}>
                <Row justify={"space-between"}>
                  <Statistic
                    title="Машин 1"
                    value={(cubageConverter(item.cbm) / machine1) * 100}
                    precision={2}
                    suffix="%"
                  />
                  <Statistic
                    title="Машин 2"
                    value={(cubageConverter(item.cbm) / machine2) * 100}
                    precision={0}
                    suffix="%"
                  />
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </ProCard>
      <ProTable<ShipmentOrder>
        formRef={ref}
        scroll={{ x: "auto" }}
        columns={[
          {
            dataIndex: "index",
            valueType: "index",
            width: 48,
          },
          {
            title: "Огноо",
            dataIndex: "createdAt",
            key: "createdAt",
            valueType: "dateTime",
            search: false,
          },
          {
            title: "Салбар",
            order: 1,
            dataIndex: "destinationNo",
            key: "destinationNo",
          },
          {
            title: "Агуулах",
            order: 10,
            dataIndex: "locationCode",
            key: "locationCode",
            valueType: "select",
            fieldProps: {
              loading: warehouseFetch.loading,
              showSearch: true,
              allowClear: true,
              options: warehouseFetch.data?.map((w) => ({
                label: `${w.name}`,
                value: w.code,
              })),
            },
          },
          {
            title: "Gate",
            order: 2,
            dataIndex: "gate",
            key: "gate",
          },
          {
            title: "Хэмжэх нэгж",
            order: 3,
            dataIndex: "unit",
            key: "unit",
            search: false,
            render: () => {
              return "m³";
            },
          },
          {
            title: "Эзлэхүүн",
            dataIndex: "cbm",
            key: "cbm",
            order: 7,
            search: false,
            render: (_, record) => {
              return <Tag color="blue">{cubageConverter(record.cbm)}m³</Tag>;
            },
          },
          {
            title: "Машин 1 /1.5тн/",
            order: 3,
            dataIndex: "unit",
            key: "unit",
            search: false,
            render: () => {
              return "8m³";
            },
          },
          {
            title: "Машин 2 /3.5тн/",
            order: 3,
            dataIndex: "unit",
            key: "unit",
            search: false,
            render: () => {
              return "16m³";
            },
          },
          {
            title: "#",
            width: 180,
            key: "option",
            fixed: "right",
            valueType: "option",
            render: (_, record) => [
              <Tooltip title="Дэлгэрэнгүй">
                <Link to={`/shipment/${record.id}`}>
                  <Button icon={<EyeOutlined />} type="link" />
                </Link>
              </Tooltip>,
            ],
          },

          // {
          //   title: "Төлөв",
          //   // order: 5,
          //   valueType: "select",
          //   fieldProps: {
          //     options: [
          //       {
          //         label: "Идэвхитэй",
          //         value: true,
          //       },
          //       {
          //         label: "Идэвхигүй",
          //         value: false,
          //       },
          //     ],
          //   },
          //   dataIndex: "isActive",
          //   render: (_, record) => {
          //     return (
          //       <Tag
          //         icon={
          //           record.isActive ? (
          //             <CheckCircleOutlined />
          //           ) : (
          //             <CloseCircleOutlined />
          //           )
          //         }
          //         color={record.isActive ? "success" : "error"}
          //         className="m-0"
          //       ></Tag>
          //     );
          //   },
          // },
        ]}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log({ sort, filter, params, aa: date.toDate() });
          const result = await fetch.runAsync({
            limit: params.pageSize || 40,
            offset: ((params.current || 1) - 1) * (params.pageSize || 40),
            date: date.toDate(),
            ...params,
          });
          setReportData(result.report);
          return {
            data: result.records,
            total: result.count,
            success: true,
          };
        }}
        columnsState={{
          persistenceKey: "client-list-table",
          persistenceType: "localStorage",
        }}
        rowKey="id"
        search={{
          labelWidth: "auto",
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSizeOptions: [20, 100, 200, 1000, 2000, 30000],
        }}
        dateFormatter="string"
        headerTitle="Shipment жагсаллт"
        toolBarRender={() => [
          // <Button
          //   key="button"
          //   icon={<PlusOutlined />}
          //   onClick={() => {
          //     setShowCreate(true);
          //   }}
          //   type="primary"
          // >
          //   Ажилтан нэмэх
          // </Button>,
        ]}
      />

      {/* {update && (
        // <UpdateClient
        //   data={update}
        //   onFinish={() => {
        //     setUpdate(null);
        //     reload();
        //   }}
        />
      )} */}
    </>
  );
};

export default ShipmentHistoryPage;
