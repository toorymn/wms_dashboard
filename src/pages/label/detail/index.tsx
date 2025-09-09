import type { ActionType } from "@ant-design/pro-components";
import {
  PageContainer,
  PageHeader,
  ProFormInstance,
  ProTable,
} from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, message } from "antd";
import { useRef } from "react";
import ShipmentService, { PreShipmentOrderItem } from "@/services/shipment";
import { useNavigate, useParams } from "react-router-dom";

const PreShipmentItemsPage = () => {
  const actionRef = useRef<ActionType>();
  const { id } = useParams();

  const navigation = useNavigate();

  const fetch = useRequest(ShipmentService.preShipmentOrderitems, {
    manual: true,
    onError: (err) => message.error(err.message),
  });

  const download = useRequest(ShipmentService.preShipmentOrderitems, {
    manual: true,
    onError: (err) => message.error(err.message),
  });

  const ref = useRef<ProFormInstance>();

  return (
    <PageContainer
      title={
        <PageHeader
          title="Pre Shipment Details"
          onBack={() => navigation("/label")}
        />
      }
    >
      <ProTable<PreShipmentOrderItem>
        formRef={ref}
        scroll={{ x: "auto" }}
        columns={[
          {
            dataIndex: "index",
            valueType: "index",
            width: 48,
          },
          {
            title: "Destination",
            dataIndex: "destination",
            key: "destination",
            search: true,
          },
          {
            title: "Bin",
            dataIndex: "takeBin",
            order: 1,
            key: "takeBin",
          },
          {
            title: "Item No",
            order: 2,
            dataIndex: "itemNo",
            key: "itemNo",
          },
          {
            title: "Name",
            order: 2,
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            search: false,
          },
          {
            title: "Cubage",
            dataIndex: "cubage",
            key: "cubage",
            search: false,
          },
          {
            title: "Quantity In Box",
            dataIndex: "quantityInBox",
            key: "quantityInBox",
            search: false,
          },
          {
            title: "Box Count",
            search: false,
            render: (_, record) => {
              return Math.ceil(record.quantity / record.quantityInBox);
            },
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
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            loading={download.loading}
            onClick={async () => {
              const tableFilters = ref.current?.getFieldsValue();

              const data = await download.runAsync(Number(id), {
                ...tableFilters,
                limit: 0,
                offset: 0,
              });

              if (data && data.records) {
                const records = data.records;
                const csvRows = [];
                // Get headers
                const headers = [
                  "Section",
                  "Store",
                  "Bin",
                  "Gate",
                  "Бар код",
                  "Барааны нэр",
                  "Packet",
                  "Sum of Box",
                ];
                csvRows.push(headers.join(","));

                // Map records to CSV
                records.forEach((record: PreShipmentOrderItem) => {
                  const row = [
                    "",
                    record.destination,
                    record.takeBin,
                    "Gate-X",
                    record.itemNo,
                    record.name,
                    record.quantityInBox,
                    Math.ceil(record.quantity / record.quantityInBox),
                  ];
                  csvRows.push(row.map((v) => `"${v ?? ""}"`).join(","));
                });

                const csvContent = "\uFEFF" + csvRows.join("\n");
                const blob = new Blob([csvContent], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "labels.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
            }}
          >
            Excel татах
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default PreShipmentItemsPage;
