import type { ActionType } from "@ant-design/pro-components";
import { ProFormInstance, ProTable } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { message, Tag } from "antd";
import { FC, useRef } from "react";
import { CountService } from "@/services";
import { WareHouseCountJournalItem } from "@/services/count";

interface Props {
  countId: number;
}

const WareHouseJournalTab: FC<Props> = ({ countId }) => {
  const actionRef = useRef<ActionType>();
  const fetch = useRequest(CountService.getCountWareHouseJournal, {
    manual: true,
    onError: (err) => message.error(err.message),
  });
  const ref = useRef<ProFormInstance>();

  // const reload = () => actionRef.current?.reload();

  return (
    <>
      <ProTable<WareHouseCountJournalItem>
        formRef={ref}
        actionRef={actionRef}
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
            title: "Bin",
            dataIndex: "binCode",
            key: "binCode",
            search: false,
          },
          {
            title: "Эхний үлдэгдэл",
            dataIndex: "quantity",
            key: "quantity",
            search: false,
          },
          {
            title: "Тоолсон тоо",
            key: "calculatedQuantity",
            search: false,
            render: (_, record) => {
              // let diff = record.level1Quantity;
              if (record.level2Quantity != null) {
                return record.level2Quantity;
              }
              return record.level1Quantity || 0;
            },
          },
          {
            title: "Зөрүү",
            search: false,
            key: "diff",
            render: (_, record) => {
              let total = 0;
              // let diff = record.level1Quantity;
              if (record.level2Quantity != null) {
                total = record.level2Quantity;
              } else if (record.level1Quantity != null) {
                total = record.level1Quantity;
              }
              const diff = record.quantity - total;
              return <Tag color={diff !== 0 ? "red" : "success"}>{diff}</Tag>;
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
        toolBarRender={() => []}
      />
    </>
  );
};

export default WareHouseJournalTab;
