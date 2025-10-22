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
import * as XLSX from "xlsx";

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

                // Prepare data for Excel export
                const worksheetData: unknown[][] = [
                  // Headers
                  [
                    "No",
                    "Section",
                    "Store",
                    "Bin",
                    "Gate",
                    "Бар код",
                    "Барааны нэр",
                    "Packet",
                    "Sum of Box",
                  ],
                  // Data rows
                ];

                let no = 1;
                // Map records to Excel data
                records.forEach((record: PreShipmentOrderItem) => {
                  const box = Math.ceil(record.quantity / record.quantityInBox);

                  for (let i = 0; i < box; i++) {
                    worksheetData.push([
                      no,
                      record.destination,
                      record.takeBin,
                      "Gate-X",
                      record.itemNo, // This will preserve leading zeros as text
                      record.name,
                      record.quantityInBox,
                      box,
                    ]);
                    no++;
                  }
                });

                // Create workbook and worksheet
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

                // Set column widths for better display
                const columnWidths = [
                  { wch: 5 }, // No
                  { wch: 12 }, // Section
                  { wch: 15 }, // Store
                  { wch: 10 }, // Bin
                  { wch: 8 }, // Gate
                  { wch: 15 }, // Бар код
                  { wch: 30 }, // Барааны нэр
                  { wch: 10 }, // Packet
                  { wch: 12 }, // Sum of Box
                ];
                worksheet["!cols"] = columnWidths;

                // Format "Бар код" column as text to preserve leading zeros
                const range = XLSX.utils.decode_range(worksheet["!ref"]!);
                for (let row = 1; row <= range.e.r; row++) {
                  const cellAddress = XLSX.utils.encode_cell({ r: row, c: 4 }); // Column E (Бар код)
                  if (worksheet[cellAddress]) {
                    worksheet[cellAddress].t = "s"; // Set cell type to string
                  }
                }

                // Add worksheet to workbook
                XLSX.utils.book_append_sheet(workbook, worksheet, "Labels");

                // Generate and download Excel file
                XLSX.writeFile(workbook, "labels.xlsx");
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
