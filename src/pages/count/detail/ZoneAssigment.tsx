import type { ActionType } from "@ant-design/pro-components";
import { EditFilled } from "@ant-design/icons";
import { ProFormInstance, ProTable } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, Flex, message, Tag, Tooltip } from "antd";
import { FC, useRef, useState } from "react";
import { CountService } from "@/services";
import { WorkerZoneAssignments } from "@/services/count";
import UpdateZoneAssignment from "./updateZoneAssignment";

interface Props {
  countId: number;
}

const WareHouseZoneAssignmentTab: FC<Props> = ({ countId }) => {
  const actionRef = useRef<ActionType>();
  const fetch = useRequest(CountService.getZones, {
    manual: true,
    onError: (err) => message.error(err.message),
  });
  const ref = useRef<ProFormInstance>();

  const [update, setUpdate] = useState<WorkerZoneAssignments>();

  const reload = () => actionRef.current?.reload();

  return (
    <>
      <ProTable<WorkerZoneAssignments>
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
            title: "Овог",
            dataIndex: "lastName",
            key: "lastName",
            search: false,
          },
          {
            title: "Нэр",
            dataIndex: "firstName",
            key: "firstName",
          },
          {
            title: "Ажилтаны код",
            dataIndex: "username",
            key: "username",
          },
          {
            title: "Эхний тооллого",
            key: "level1",
            render: (_, record) => {
              return (
                <Flex gap="4px 0" wrap>
                  {record.zones
                    .filter((z) => z.level == 1)
                    .map((z) => (
                      <Tag color="volcano">{z.no}</Tag>
                    ))}
                </Flex>
              );
            },
          },
          {
            title: "Давтан тооллого",
            key: "level2",
            search: false,
            render: (_, record) => {
              return (
                <Flex gap="4px 0" wrap>
                  {record.zones
                    .filter((z) => z.level == 2)
                    .map((z) => (
                      <Tag color="purple">{z.no}</Tag>
                    ))}
                </Flex>
              );
            },
          },
          {
            title: "#",
            width: 180,
            key: "option",
            fixed: "right",
            valueType: "option",
            render: (_, record) => [
              <Tooltip title="Засах">
                <Button
                  ghost
                  key="edit"
                  size="small"
                  type="primary"
                  icon={<EditFilled />}
                  onClick={() => {
                    setUpdate(record);
                  }}
                />
              </Tooltip>,
            ],
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

      {update && (
        <UpdateZoneAssignment
          data={{
            ...update,
            countId,
          }}
          onClose={(refresh) => {
            refresh && reload();
            setUpdate(undefined);
          }}
        />
      )}
    </>
  );
};

export default WareHouseZoneAssignmentTab;
