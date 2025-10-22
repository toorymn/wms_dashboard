import type { ActionType } from "@ant-design/pro-components";
import { DownloadOutlined } from "@ant-design/icons";
import { ProFormInstance, ProTable } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, message, Tag } from "antd";
import { FC, useRef, useState } from "react";
import { CountService } from "@/services";
import { InternalJournalItem } from "@/services/count";

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
                      const csvRows = [];
                      // Get headers
                      const headers = [
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
                      ];
                      csvRows.push(headers.join(","));

                      // Map records to CSV
                      records.forEach((record: InternalJournalItem) => {
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
                          diff = record.level2Quantity - record.level1Quantity;
                        }

                        const row = [
                          record.itemNo,
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

                        csvRows.push(row.map((v) => `"${v ?? ""}"`).join(","));
                      });

                      const csvContent = "\uFEFF" + csvRows.join("\n");
                      const blob = new Blob([csvContent], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const url = URL.createObjectURL(blob);

                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute(
                        "download",
                        `internal_journal_zone_${zoneFilter}.csv`
                      );
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
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
