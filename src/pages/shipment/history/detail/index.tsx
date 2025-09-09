import type { ActionType } from "@ant-design/pro-components";
import {
  PageContainer,
  PageHeader,
  ProDescriptions,
  ProFormInstance,
  ProTable,
} from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Card, message } from "antd";
import { useRef } from "react";
import ShipmentService, {
  ShipmentOrder,
  ShipmentOrderItem,
} from "@/services/shipment";
import { useNavigate, useParams } from "react-router-dom";

const ShipmentItemsPage = () => {
  const actionRef = useRef<ActionType>();
  const { id } = useParams();

  const navigation = useNavigate();

  const orderfetch = useRequest(ShipmentService.shipment, {
    defaultParams: [Number(id)],
    manual: false,
    onError: (err) => message.error(err.message),
  });

  const fetch = useRequest(ShipmentService.shipmentItems, {
    manual: true,
    onError: (err) => message.error(err.message),
  });
  const ref = useRef<ProFormInstance>();
  // const reload = () => actionRef.current?.reload();

  return (
    <PageContainer
      title={
        <PageHeader
          title="Shipment Details"
          onBack={() => navigation("/shipment")}
        />
      }
    >
      <Card style={{ marginBottom: 24 }}>
        <ProDescriptions
          loading={orderfetch.loading}
          column={2}
          dataSource={orderfetch.data || []}
          bordered
          columns={[
            {
              title: "Gate",
              dataIndex: "gate",
            },
            {
              title: "Destination No",
              dataIndex: "destinationNo",
            },
            {
              title: "Date",
              dataIndex: "createdAt",
              valueType: "dateTime",
            },
            {
              title: "Cbm",
              dataIndex: "cbm",
              render: (_, record) =>
                `${(record as ShipmentOrder).cbm ?? ""} m³`,
            },
          ]}
        />
      </Card>
      <ProTable<ShipmentOrderItem>
        formRef={ref}
        scroll={{ x: "auto" }}
        columns={[
          {
            dataIndex: "index",
            valueType: "index",
            width: 48,
          },
          {
            title: "Item No",
            order: 2,
            dataIndex: "itemNo",
            key: "itemNo",
          },
          {
            title: "Name",
            order: 1,
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
          },
          {
            title: "Cubage",
            dataIndex: "cubage",
            key: "cubage",
          },
          {
            title: "PlaceBin",
            dataIndex: "placeBin",
            key: "placeBin",
          },
        ]}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log(sort, filter);
          const result = await fetch.runAsync(Number(id), {
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
        headerTitle=""
        toolBarRender={() => []}
      />
    </PageContainer>
  );
};

export default ShipmentItemsPage;
