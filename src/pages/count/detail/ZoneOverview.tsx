import type { ActionType } from "@ant-design/pro-components";
import { ProFormInstance, ProTable } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { message, Tag } from "antd";
import { FC, useRef } from "react";
import { CountService } from "@/services";
import { ZoneAssignmentOverview } from "@/services/count";

interface Props {
  countId: number;
}

const ZoneOverViewTab: FC<Props> = ({ countId }) => {
  const actionRef = useRef<ActionType>();
  const fetch = useRequest(CountService.zonesOverview, {
    manual: true,
    onError: (err) => message.error(err.message),
  });
  const ref = useRef<ProFormInstance>();

  return (
    <>
      <ProTable<ZoneAssignmentOverview>
        formRef={ref}
        actionRef={actionRef}
        scroll={{ x: "auto" }}
        columns={[
          {
            title: "№",
            dataIndex: "index",
            valueType: "index",
            width: 48,
          },
          {
            title: "Бүс",
            dataIndex: "zone",
            key: "zone",
            search: false,
          },
          {
            title: "Тоологч овог",
            dataIndex: "level1LastName",
            key: "level1LastName",
            search: false,
          },
          {
            title: "Тоологч нэр",
            dataIndex: "level1FirstName",
            key: "level1FirstName",
            search: false,
          },

          {
            title: "Баталгаажуулагч овог",
            dataIndex: "level2LastName",
            key: "level2LastName",
            search: false,
          },
          {
            title: "Баталгаажуулагч нэр",
            dataIndex: "level2FirstName",
            key: "level2FirstName",
            search: false,
          },

          {
            title: "Тоолсон",
            dataIndex: "level1Total",
            key: "level1Total",
            search: false,
          },
          {
            title: "Баталгаажсан тоо",
            dataIndex: "level2Total",
            key: "level2Total",
            search: false,
          },
          {
            title: "Зөрүү",
            search: false,
            key: "diff",
            render: (_, record) => {
              let diff = 0;
              if (record.level1Total != null && record.level2Total == null) {
                diff = -record.level1Total;
              }

              if (record.level2Total != null && record.level1Total == null) {
                diff = -record.level2Total;
              }

              if (record.level2Total != null && record.level1Total != null) {
                diff = record.level1Total - record.level2Total;
              }

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

export default ZoneOverViewTab;
