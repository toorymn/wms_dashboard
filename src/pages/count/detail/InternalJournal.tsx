import type { ActionType } from "@ant-design/pro-components";
import { DownloadOutlined } from "@ant-design/icons";
import { ProFormInstance, ProTable } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, message, Tag } from "antd";
import { FC, useRef, useState } from "react";
import { CountService } from "@/services";
import { InternalJournalItem } from "@/services/count";
import * as XLSX from "xlsx";

interface Props {
  countId: number;
}

const CountInternalJournalTab: FC<Props> = ({ countId }) => {
  const actionRef = useRef<ActionType>();
  const fetch = useRequest(CountService.getCountInternalJournal, {
    manual: true,
    onError: (err) => message.error(err.message),
  });
  const ref = useRef<ProFormInstance>();
  const [zoneFilter, setZoneFilter] = useState<number | null>(null);

  const download = useRequest(CountService.getCountInternalJournal, {
    manual: true,
    onError: (err) => message.error(err.message),
  });

  // const reload = () => actionRef.current?.reload();

  console.log({ zoneFilter });
  return (
    <>
      <ProTable<InternalJournalItem>
        formRef={ref}
        actionRef={actionRef}
        columnEmptyText={"-"}
        id="internal-journal-table"
        scroll={{ x: "auto" }}
        columns={[
          {
            dataIndex: "index",
            valueType: "index",
            width: 48,
          },
          {
            title: "Барааны код",
            order: 1,
            dataIndex: "itemNo",
            key: "itemNo",
          },
          {
            title: "Огноо",
            dataIndex: "createdAt",
            valueType: "dateTime",
            key: "createdAt",
            search: false,
          },
          {
            title: "Барааны нэр",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Хэмжих нэгж",
            dataIndex: "unitOfMeasureCode",
            key: "unitOfMeasureCode",
            search: false,
          },
          {
            title: "Тооллогын бүс",
            dataIndex: "zone",
            key: "zone",
            valueType: "digit",
            fieldProps: {
              value: zoneFilter,
              onChange: (value: number) => setZoneFilter(value),
            },
          },
          {
            title: "Тоологчийн нэр",
            search: false,
            render: (_, record) => {
              if (
                record.level1WorkerLastName == null ||
                record.level1WorkerFirstName == null
              ) {
                return "-";
              }

              return `${record.level1WorkerLastName?.at(0)}.${
                record.level1WorkerFirstName ?? ""
              }`;
            },
          },
          {
            title: " Баталгаажуулагчийн нэр",
            search: false,
            render: (_, record) => {
              if (
                record.level2WorkerLastName == null ||
                record.level2WorkerFirstName == null
              ) {
                return "-";
              }

              return `${record.level2WorkerLastName?.at(0)}.${
                record.level2WorkerFirstName ?? ""
              }`;
            },
          },
          {
            title: "Bin",
            dataIndex: "binCode",
            key: "binCode",
          },
          {
            title: "Тоолсон тоо",
            dataIndex: "level1Quantity",
            key: "level1Quantity",
            search: false,
          },
          {
            title: "Баталгаажуулсан тоо",
            dataIndex: "level2Quantity",
            key: "level2Quantity",
            search: false,
          },
          {
            title: "Зөрүү",
            search: false,
            key: "diff",
            render: (_, record) => {
              let diff = 0;
              if (
                record.level2Quantity != null &&
                record.level1Quantity == null
              ) {
                diff = -record.level2Quantity;
              }

              if (
                record.level1Quantity != null &&
                record.level2Quantity == null
              ) {
                diff = -record.level1Quantity;
              }

              if (
                record.level1Quantity != null &&
                record.level2Quantity != null
              ) {
                diff = record.level2Quantity - record.level1Quantity;
              }

              return <Tag>{diff}</Tag>;
            },
          },
        ]}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log(sort, filter);
          const result = await fetch.runAsync(countId, {
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
        headerTitle="Тооллогын жагсаалт"
        toolBarRender={() => {
          const isZoneValid = zoneFilter !== null && zoneFilter !== undefined;

          return isZoneValid
            ? [
                <Button
                  loading={download.loading}
                  key="button"
                  type="dashed"
                  icon={<DownloadOutlined />}
                  onClick={async () => {
                    const tableFilters = ref.current?.getFieldsValue();

                    const data = await download.runAsync(Number(countId), {
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
                          "Барааны код",
                          "Огноо",
                          "Барааны нэр",
                          "Хэмжих нэгж",
                          "Тооллогын бүс",
                          "Тоологчийн нэр",
                          "Баталгаажуулагын нэр",
                          "Bin",
                          "Тоолсон тоо",
                          "Баталгаажуулсан тоо",
                          "Зөрүү",
                        ],
                        // Data rows
                        ...records.map((record: InternalJournalItem) => {
                          const level1Worker =
                            record.level1WorkerLastName &&
                            record.level1WorkerFirstName
                              ? `${record.level1WorkerLastName?.at(0)}.${
                                  record.level1WorkerFirstName
                                }`
                              : "-";

                          const level2Worker =
                            record.level2WorkerLastName &&
                            record.level2WorkerFirstName
                              ? `${record.level2WorkerLastName?.at(0)}.${
                                  record.level2WorkerFirstName
                                }`
                              : "-";

                          let diff = 0;
                          if (
                            record.level2Quantity != null &&
                            record.level1Quantity == null
                          ) {
                            diff = -record.level2Quantity;
                          }
                          if (
                            record.level1Quantity != null &&
                            record.level2Quantity == null
                          ) {
                            diff = -record.level1Quantity;
                          }
                          if (
                            record.level1Quantity != null &&
                            record.level2Quantity != null
                          ) {
                            diff =
                              record.level2Quantity - record.level1Quantity;
                          }

                          return [
                            record.itemNo, // Will preserve leading zeros as text
                            record.createdAt,
                            record.description,
                            record.unitOfMeasureCode,
                            record.zone,
                            level1Worker,
                            level2Worker,
                            record.binCode,
                            record.level1Quantity ?? "-",
                            record.level2Quantity ?? "-",
                            diff,
                          ];
                        }),
                      ];

                      // Create workbook and worksheet
                      const workbook = XLSX.utils.book_new();
                      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

                      // Set column widths for better display
                      const columnWidths = [
                        { wch: 15 }, // Барааны код
                        { wch: 18 }, // Огноо
                        { wch: 30 }, // Барааны нэр
                        { wch: 12 }, // Хэмжих нэгж
                        { wch: 12 }, // Тооллогын бүс
                        { wch: 15 }, // Тоологчийн нэр
                        { wch: 18 }, // Баталгаажуулагын нэр
                        { wch: 10 }, // Bin
                        { wch: 12 }, // Тоолсон тоо
                        { wch: 18 }, // Баталгаажуулсан тоо
                        { wch: 8 }, // Зөрүү
                      ];
                      worksheet["!cols"] = columnWidths;

                      // Format "Барааны код" column as text to preserve leading zeros
                      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
                      for (let row = 1; row <= range.e.r; row++) {
                        const cellAddress = XLSX.utils.encode_cell({
                          r: row,
                          c: 0,
                        }); // Column A (Барааны код)
                        if (worksheet[cellAddress]) {
                          worksheet[cellAddress].t = "s"; // Set cell type to string
                        }
                      }

                      // Add worksheet to workbook
                      XLSX.utils.book_append_sheet(
                        workbook,
                        worksheet,
                        "Internal Journal"
                      );

                      // Generate and download Excel file
                      XLSX.writeFile(
                        workbook,
                        `internal_journal_zone_${zoneFilter}.xlsx`
                      );
                    }
                  }}
                >
                  Тайлан татах
                </Button>,
              ]
            : [];
        }}
      />
    </>
  );
};

export default CountInternalJournalTab;
