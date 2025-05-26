import type { ActionType } from "@ant-design/pro-components";
import { ProFormInstance, ProTable } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { message, Tag } from "antd";
import { FC, useRef } from "react";
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

  const reload = () => actionRef.current?.reload();

  return (
    <>
      <ProTable<InternalJournalItem>
        formRef={ref}
        actionRef={actionRef}
        columnEmptyText={"-"}
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
          },
          {
            title: "Тооллогчын нэр",
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
            title: "Баталгажуулагийн нэр",
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
        toolBarRender={() => []}
      />
    </>
  );
};

export default CountInternalJournalTab;
