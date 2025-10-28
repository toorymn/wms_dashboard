import type { ActionType } from "@ant-design/pro-components";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
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
import * as XLSX from "xlsx";

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

  const download = useRequest(ShipmentService.shipmentDownload, {
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
          <Button
            loading={download.loading}
            key="button"
            type="dashed"
            icon={<DownloadOutlined />}
            onClick={async () => {
              const tableFilters = ref.current?.getFieldsValue();

              const data = await download.runAsync({
                ...tableFilters,
                date: date.toDate(),
                limit: 0,
                offset: 0,
              });

              if (data && data.length > 0) {
                // Prepare data for Excel export
                const worksheetData: unknown[][] = [
                  // Headers
                  [
                    "№",
                    "Destination No",
                    "Item No",
                    "Name",
                    "Quantity",
                    "Cubage",
                    "PlaceBin",
                  ],
                  // Data rows
                  ...data.map((record, idx) => [
                    idx + 1,
                    record.destinationNo,
                    record.itemNo,
                    record.name,
                    record.quantity,
                    cubageConverter(record.cubage),
                    record.placeBin,
                  ]),
                ];

                // Create workbook and worksheet
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

                // Set column widths for better display
                const columnWidths = [
                  { wch: 5 }, // №
                  { wch: 12 }, // Салбар
                  { wch: 25 }, // Салбарын нэр
                  { wch: 12 }, // Агуулах
                  { wch: 12 }, // Тоо ширхэг
                  { wch: 15 }, // Эзлэхүүн
                  { wch: 15 }, // Байршил
                ];
                worksheet["!cols"] = columnWidths;

                // Format destination code as text to preserve leading zeros
                const range = XLSX.utils.decode_range(worksheet["!ref"]!);
                for (let row = 1; row <= range.e.r; row++) {
                  const cellAddress = XLSX.utils.encode_cell({ r: row, c: 1 }); // Column B (Салбар)
                  if (worksheet[cellAddress]) {
                    worksheet[cellAddress].t = "s"; // Set cell type to string
                  }
                }

                // Add worksheet to workbook
                XLSX.utils.book_append_sheet(
                  workbook,
                  worksheet,
                  "Shipment History"
                );

                // Generate and download Excel file
                const fileName = `shipment_history_${date.format(
                  "YYYY-MM-DD"
                )}.xlsx`;
                XLSX.writeFile(workbook, fileName);
              } else {
                message.warning("Татах өгөгдөл байхгүй байна");
              }
            }}
          />,
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
