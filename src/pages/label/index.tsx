import type { ActionType } from "@ant-design/pro-components";
import {
  PageContainer,
  ProFormInstance,
  ProTable,
} from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, DatePicker, Tag, Tooltip, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { FC, useRef, useState } from "react";
import ShipmentService, { PreShipmentOrder } from "@/services/shipment";
import { Link } from "react-router-dom";
import ReferenceService from "@/services/ref";
import { cubageConverter } from "@/utils/const";

const PreShipmentPage: FC = () => {
  const actionRef = useRef<ActionType>();

  const [reportDate, setReportDate] = useState(dayjs().startOf("day"));
  const fetch = useRequest(ShipmentService.preShipmentOrders, {
    manual: true,
    refreshDeps: [reportDate],
    onError: (err) => message.error(err.message),
  });

  const warehouseFetch = useRequest(ReferenceService.warehouses, {
    // manual: true,
    onError: (err) => message.error(err.message),
  });

  const ref = useRef<ProFormInstance>();

  return (
    <>
      <PageContainer
        title="Shipment жагсаалт"
        extra={
          <DatePicker
            value={reportDate}
            onChange={(date) => setReportDate(date)}
          />
        }
      >
        <ProTable<PreShipmentOrder>
          formRef={ref}
          scroll={{ x: "auto" }}
          columns={[
            {
              dataIndex: "index",
              valueType: "index",
              width: 48,
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
              title: "Ship No",
              dataIndex: "no",
              key: "no",
              search: false,
            },
            {
              title: "Огноо",
              dataIndex: "createdAt",
              key: "createdAt",
              valueType: "dateTime",
              search: false,
            },
            {
              title: "Posted Date",
              dataIndex: "postedDate",
              key: "postedDate",
              valueType: "date",
              search: false,
            },
            {
              title: "Эзэлхүүн",
              dataIndex: "cbm",
              key: "cbm",
              order: 7,
              search: false,
              render: (_, record) => {
                return <Tag color="blue">{cubageConverter(record.cbm)}m³</Tag>;
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
                  <Link to={`/label/${record.id}`}>
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
          request={async (params = {}) => {
            const result = await fetch.runAsync({
              date: reportDate.toDate(),
              limit: params.pageSize || 40,
              offset: ((params.current || 1) - 1) * (params.pageSize || 40),
              ...params,
            });
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
          // headerTitle="Жагсаалт"
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
      </PageContainer>

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

export default PreShipmentPage;
