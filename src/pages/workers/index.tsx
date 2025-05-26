import { EditFilled, PlusOutlined } from "@ant-design/icons";
import type { ActionType } from "@ant-design/pro-components";
import { ProFormInstance, ProTable } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, Tag, Tooltip, message } from "antd";
import { useRef, useState } from "react";
// import CreateClient from "./create";
// import UpdateClient from "./update";
import { WorkerService } from "@/services";
import { WorkerAccount } from "@/services/worker";
import CreateWorkerAccount from "./create";

const WorkersPage = () => {
  const actionRef = useRef<ActionType>();
  const [showCreate, setShowCreate] = useState(false);
  const [__, setUpdate] = useState<null | WorkerAccount>(null);
  const fetch = useRequest(WorkerService.getWorkerList, {
    manual: true,
    onError: (err) => message.error(err.message),
  });
  const ref = useRef<ProFormInstance>();
  const reload = () => actionRef.current?.reload();

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
            title: "Нэвтрэх нэр",
            order: 3,
            dataIndex: "username",
            key: "username",
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
          {
            title: "Агуулах",
            dataIndex: "accessWareHouses",
            key: "accessWareHouses",
            order: 7,
            search: false,
            // valueType: "select",
            // fieldProps: {
            //   options: COMPANIES.map((item) => {
            //     return {
            //       label: item.name,
            //       value: item.id,
            //     };
            //   }),
            // },
            render: (_, record) => {
              return (
                <Tag color="blue">{record.accessWareHouses.join(",")}</Tag>
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
        headerTitle="Ажилчдын жагсаалт"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowCreate(true);
            }}
            type="primary"
          >
            Ажилтан нэмэх
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

export default WorkersPage;
