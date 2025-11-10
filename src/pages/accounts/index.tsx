import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditFilled,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType } from "@ant-design/pro-components";
import { ProFormInstance, ProTable } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, Popconfirm, Tag, Tooltip, message } from "antd";
import { useRef, useState } from "react";
import { WorkerService } from "@/services";
import { WorkerAccount } from "@/services/worker";
import CreateWorkerAccount from "./create";
import UpdateWorkerAccount from "./update";

const WorkersPage = () => {
  const actionRef = useRef<ActionType>();
  const [showCreate, setShowCreate] = useState(false);
  const [update, setUpdate] = useState<null | WorkerAccount>(null);
  const fetch = useRequest(WorkerService.getWorkerList, {
    manual: true,
    onError: (err) => message.error(err.message),
  });
  const ref = useRef<ProFormInstance>();
  const reload = () => actionRef.current?.reload();

  const updateStatus = useRequest(WorkerService.updateWorkerStatus, {
    manual: true,
    onError: (err) => message.error(err.message),
  });

  return (
    <>
      <ProTable<WorkerAccount>
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
            valueType: "dateRange",
            search: false,
            hideInTable: true,
          },
          {
            title: "Нэр",
            order: 1,
            dataIndex: "firstName",
            key: "firstName",
          },
          {
            title: "Овог",
            order: 2,
            dataIndex: "lastName",
            key: "lastName",
          },
          {
            title: "Үүрэг",
            order: 2,
            dataIndex: "role",
            key: "role",
            valueType: "select",
            fieldProps: {
              options: [
                {
                  label: "Менежер",
                  value: 110,
                },
                {
                  label: "Ажилтан",
                  value: 200,
                },
              ],
            },
            render: (_, record) => {
              const roleMap = {
                110: "Менежер",
                200: "Ажилтан",
              };
              return (
                roleMap[record.role as keyof typeof roleMap] || record.role
              );
            },
          },
          {
            title: "Нэвтрэх нэр",
            order: 3,
            dataIndex: "username",
            key: "username",
          },
          {
            title: "Агуулах",
            dataIndex: "accessWareHouses",
            key: "accessWareHouses",
            order: 7,
            search: false,
            render: (_, record) => {
              return (
                <Tag color="blue">{record.accessWareHouses.join(",")}</Tag>
              );
            },
          },
          {
            title: "Төлөв",
            // order: 5,
            valueType: "select",
            fieldProps: {
              options: [
                {
                  label: "Идэвхитэй",
                  value: true,
                },
                {
                  label: "Идэвхигүй",
                  value: false,
                },
              ],
            },
            dataIndex: "isActive",
            render: (_, record) => {
              return (
                <Popconfirm
                  disabled={updateStatus.loading}
                  title={`Та ${
                    record.isActive ? "идэвхигүй" : "идэвхитэй"
                  } болгох уу?`}
                  onConfirm={async () => {
                    await updateStatus.runAsync({
                      accountId: record.id,
                      isActive: !record.isActive,
                    });
                    reload();
                  }}
                  okText="Тийм"
                  cancelText="Үгүй"
                >
                  <Tag
                    icon={
                      record.isActive ? (
                        <CheckCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      )
                    }
                    color={record.isActive ? "success" : "error"}
                    className="m-0"
                  ></Tag>
                </Popconfirm>
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
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log(sort, filter);
          const result = await fetch.runAsync({
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
        headerTitle="Хэрэглэгчдийн жагсаалт"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowCreate(true);
            }}
            type="primary"
          >
            Хэрэглэгч үүсгэх
          </Button>,
        ]}
      />
      {showCreate && (
        <CreateWorkerAccount
          onFinish={() => {
            setShowCreate(false);
            reload();
          }}
        />
      )}
      {update && (
        <UpdateWorkerAccount
          data={update}
          onFinish={() => {
            setUpdate(null);
            reload();
          }}
        />
      )}
    </>
  );
};

export default WorkersPage;
